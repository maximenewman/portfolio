"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { AdditiveBlending, Color, MathUtils, NormalBlending, type Points, type ShaderMaterial } from "three"

/**
 * The lattice: a displaced grid of points standing in for the things this
 * portfolio is actually about — matrix tiles, graph nodes, a scan sweeping a
 * codebase. It reacts to the pointer on desktop and to touch-drag on mobile
 * through the same `pointermove` path, so there is no hover-only behaviour.
 *
 * GLSL is inline template literals on purpose: `.glsl` file imports fail under
 * both Turbopack and webpack, and the `turbopack.rules` + raw-loader fix only
 * covers one of the two bundlers this project can build with.
 */

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec2  uPointer;   // -1..1, viewport-relative
  uniform float uScroll;    // 0..1 page progress
  uniform float uSize;
  uniform float uAmp;
  uniform float uReach;
  uniform float uPulse;     // uTime at the moment the kick landed
  uniform vec2  uPulseCenter;
  uniform vec2  uBall;      // ball position while a kick is in flight
  uniform float uBallOn;

  attribute float aSeed;

  varying float vGlow;
  varying float vEvent;
  varying float vDepth;

  void main() {
    vec3 p = position;

    // Two offset waves rather than one, so the surface never resolves into a
    // single readable sine.
    float swell =
        sin(p.x * 0.55 + uTime * 0.55 + aSeed * 6.2831) * 0.5
      + cos(p.y * 0.42 - uTime * 0.40) * 0.5;
    p.z += swell * uAmp;

    // Page progress slowly rewrites the field, so scrolling changes what you
    // are looking at without any scroll-linked camera work.
    p.z += sin(p.x * 0.18 + uScroll * 6.2831) * uAmp * 0.55;

    // Pointer well. Mapped into the same units as the grid so the falloff
    // radius stays stable across viewport sizes.
    vec2 pointerWorld = uPointer * vec2(15.0, 10.0);
    float influence = 1.0 - smoothstep(0.0, uReach, distance(p.xy, pointerWorld));
    p.z += influence * 2.4;

    // The kicked ball: a tight bright bump travelling along its flight path.
    // Kick and impact glow live in their own channel (vEvent) so the opacity
    // boost they get in the fragment shader never applies to the pointer
    // well, which must stay quiet under text.
    float eventGlow = 0.0;
    if (uBallOn > 0.5) {
      float ballDist = distance(p.xy, uBall);
      float bump = exp(-ballDist * ballDist * 1.4);
      p.z += bump * 2.6;
      eventGlow = max(eventGlow, bump);
    }

    // Impact ripple: a ring that expands from wherever the ball came down and
    // dies out over about two seconds. uPulse starts far in the past so a
    // fresh page load has no wave in flight.
    float age = uTime - uPulse;
    if (age >= 0.0 && age < 2.5) {
      float dist = distance(p.xy, uPulseCenter);
      float ring = exp(-pow(dist - age * 9.0, 2.0) * 0.22) * exp(-age * 1.4);
      p.z += ring * 3.2;
      eventGlow = max(eventGlow, ring);
    }

    influence = max(influence, eventGlow);

    vGlow = influence;
    vEvent = eventGlow;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // Fade only the genuinely distant rows. The previous linear ramp peaked
    // at ~0.42 where the plane actually sits, quietly halving every point's
    // alpha and washing the whole field out.
    vDepth = smoothstep(-34.0, -14.0, mv.z);

    gl_Position = projectionMatrix * mv;
    // Points are fill-rate bound, so point size matters more than point count.
    gl_PointSize = uSize * (1.0 + influence * 0.9) * (12.0 / -mv.z);
  }
`

const FRAGMENT = /* glsl */ `
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uOpacity;
  uniform float uFold;

  varying float vGlow;
  varying float vEvent;
  varying float vDepth;

  void main() {
    // Squared distance — avoids a sqrt per fragment.
    vec2 c = gl_PointCoord - 0.5;
    float d2 = dot(c, c);
    if (d2 > 0.25) discard;

    float alpha = smoothstep(0.25, 0.01, d2);

    // Half strength on the hue shift: at full mix the pointer well reads as a
    // coloured blob sitting on top of whatever you are reading.
    vec3 col = mix(uColorA, uColorB, clamp(vGlow, 0.0, 1.0) * 0.5);

    // The field is a hero moment, not a page-long texture. It recedes as soon
    // as you scroll into the reading column, which is the only place it can
    // compete with body copy — the cards used to back the text, and now
    // nothing does.
    // Measured against the fold, not against total page progress: a fraction
    // of the document means a very different number of pixels on a short page
    // than on a long one, so page progress left the field sitting over body
    // copy on the longer pages.
    float recede = mix(1.0, 0.28, smoothstep(0.1, 0.85, uFold));

    // The ambient field is quiet by design, but the kick is the site's one
    // hero interaction and has to read at full strength in both themes and at
    // any scroll depth. Points caught in the ball or its impact ring override
    // the ambient opacity instead of multiplying into it.
    float ambient = alpha * uOpacity * vDepth * recede;
    float event = alpha * clamp(vEvent, 0.0, 1.0) * 0.85;

    gl_FragColor = vec4(col, max(ambient, event));
    #include <colorspace_fragment>
  }
`

type LatticeFieldProps = {
  /** Fewer points and a calmer field on touch hardware. */
  lowPower: boolean
  dark: boolean
  /** When true the field renders one static frame and stops. */
  paused: boolean
}

export function LatticeField({ lowPower, dark, paused }: LatticeFieldProps) {
  const pointsRef = useRef<Points>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const { invalidate } = useThree()

  // Pointer and scroll live in refs, not state: they change every frame and
  // must never trigger a React render.
  const pointerTarget = useRef<[number, number]>([0, 0])
  const pointerCurrent = useRef<[number, number]>([0, 0])
  const scrollTarget = useRef(0)
  const scrollCurrent = useRef(0)
  const foldTarget = useRef(0)
  const foldCurrent = useRef(0)
  // A kick in flight. t0 is null until the frame loop first sees the kick:
  // the click handler must not need the material or the running loop, so a
  // kick made while the tab is hidden simply flies when rendering resumes.
  const kickRef = useRef<{
    t0: number | null
    from: [number, number]
    ctrl: [number, number]
    to: [number, number]
  } | null>(null)

  const cols = lowPower ? 82 : 148
  const rows = lowPower ? 46 : 82

  // ~3.8k points on touch, ~12.1k on desktop — inside the researched budget.
  const { positions, seeds, count } = useMemo(() => {
    const total = cols * rows
    const pos = new Float32Array(total * 3)
    const sd = new Float32Array(total)
    const spanX = 44
    const spanY = 27

    for (let iy = 0; iy < rows; iy++) {
      for (let ix = 0; ix < cols; ix++) {
        const i = iy * cols + ix
        pos[i * 3] = (ix / (cols - 1) - 0.5) * spanX
        pos[i * 3 + 1] = (iy / (rows - 1) - 0.5) * spanY
        pos[i * 3 + 2] = 0
        // Deterministic pseudo-random: a real RNG would make the field differ
        // between server and client if this ever moved out of the browser.
        sd[i] = ((Math.sin(ix * 12.9898 + iy * 78.233) * 43758.5453) % 1 + 1) % 1
      }
    }
    return { positions: pos, seeds: sd, count: total }
  }, [cols, rows])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: [0, 0] as [number, number] },
      uScroll: { value: 0 },
      uFold: { value: 0 },
      uSize: { value: lowPower ? 2.2 : 2.6 },
      uAmp: { value: 1.15 },
      uReach: { value: 6.0 },
      uPulse: { value: -100 },
      uPulseCenter: { value: [0, 0] as [number, number] },
      uBall: { value: [0, 0] as [number, number] },
      uBallOn: { value: 0 },
      // `new Color(hex)` converts sRGB to the linear working space, which is
      // what the shader's trailing `colorspace_fragment` expects. Passing raw
      // triples instead means the conversion lightens them on output — a deep
      // indigo leaves the shader as a pale lilac.
      uColorA: { value: new Color(dark ? "#4ade80" : "#15803d") },
      uColorB: { value: new Color(dark ? "#8051ff" : "#5433eb") },
      uOpacity: { value: dark ? 0.55 : 0.28 },
    }),
    // Rebuilt when the theme or power tier flips; not mutated here.
    [dark, lowPower],
  )

  // Pointer is read from the window, not the canvas: the canvas is
  // `pointer-events: none` so it can never intercept a scroll, a tap or a
  // link. Touch-dragging the page moves the pointer too, which is what makes
  // this interactive on mobile without a touch-specific code path.
  useEffect(() => {
    if (paused) return

    const onPointer = (e: PointerEvent) => {
      pointerTarget.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      ]
    }

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollTarget.current = max > 0 ? window.scrollY / max : 0
      // Independent of page length: how far past the first screenful we are.
      foldTarget.current = Math.min(1, window.scrollY / window.innerHeight)
    }

    window.addEventListener("pointermove", onPointer, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("scroll", onScroll)
    }
  }, [paused])

  // The nav logo fires this. The ball launches from the top-left of the field
  // (under the logo), bends through a curled arc, and the impact ripple fires
  // where it lands. Spin bends a football, so the flight is a bezier rather
  // than a straight line.
  //
  // Deliberately NOT gated behind `paused`: attaching a listener is free, and
  // gating it couples the interaction to visibility timing — a click made
  // moments after a tab regains focus would race the effect re-run and be
  // silently lost. The handler only records intent; the frame loop, which is
  // what the pause actually controls, decides whether anything moves.
  useEffect(() => {
    const onPulse = () => {
      const from: [number, number] = [-20, 12]
      const to: [number, number] = [-6 + Math.random() * 14, -6 + Math.random() * 11]
      // Control point off the chord's midpoint, so every kick curls a little
      // differently.
      const mid: [number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
      const ctrl: [number, number] = [mid[0] + 3 + Math.random() * 6, mid[1] + 5 + Math.random() * 4]
      kickRef.current = { t0: null, from, ctrl, to }
    }
    window.addEventListener("lattice-pulse", onPulse)
    return () => window.removeEventListener("lattice-pulse", onPulse)
  }, [])

  // Paused means "one static frame", not "unmounted" — the composition should
  // still read correctly with motion off.
  useEffect(() => {
    if (paused) invalidate()
  }, [paused, invalidate])

  useFrame((_, delta) => {
    const material = materialRef.current
    const mesh = pointsRef.current
    if (!material || !mesh) return

    // Clamp delta: a backgrounded tab returns with a huge one, which would
    // snap the whole field in a single frame.
    const dt = Math.min(delta, 0.1)

    const [tx, ty] = pointerTarget.current
    const [cx, cy] = pointerCurrent.current
    pointerCurrent.current = [MathUtils.damp(cx, tx, 4, dt), MathUtils.damp(cy, ty, 4, dt)]
    scrollCurrent.current = MathUtils.damp(scrollCurrent.current, scrollTarget.current, 3, dt)
    foldCurrent.current = MathUtils.damp(foldCurrent.current, foldTarget.current, 5, dt)

    material.uniforms.uTime.value += dt
    material.uniforms.uPointer.value = pointerCurrent.current

    // Advance a kick in flight. Ease-out, because a struck ball decelerates.
    const kick = kickRef.current
    if (kick) {
      const flight = 0.7
      // First frame that sees this kick starts the clock.
      const t0 = kick.t0 ?? material.uniforms.uTime.value
      kick.t0 = t0
      const age = material.uniforms.uTime.value - t0
      if (age >= flight) {
        material.uniforms.uBallOn.value = 0
        material.uniforms.uPulseCenter.value = kick.to
        material.uniforms.uPulse.value = material.uniforms.uTime.value
        kickRef.current = null
      } else {
        const t = age / flight
        const e = 1 - (1 - t) * (1 - t)
        const inv = 1 - e
        material.uniforms.uBall.value = [
          inv * inv * kick.from[0] + 2 * inv * e * kick.ctrl[0] + e * e * kick.to[0],
          inv * inv * kick.from[1] + 2 * inv * e * kick.ctrl[1] + e * e * kick.to[1],
        ]
        material.uniforms.uBallOn.value = 1
      }
    }
    material.uniforms.uScroll.value = scrollCurrent.current
    material.uniforms.uFold.value = foldCurrent.current

    mesh.rotation.z = Math.sin(material.uniforms.uTime.value * 0.05) * 0.04
  })

  return (
    <points ref={pointsRef} rotation={[-0.42, 0, 0]} position={[0, -1.5, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        args={[{ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms }]}
        transparent
        depthWrite={false}
        // Additive glows on a dark ground but blows out to white on paper.
        blending={dark ? AdditiveBlending : NormalBlending}
        key={`${dark}-${count}`}
      />
    </points>
  )
}
