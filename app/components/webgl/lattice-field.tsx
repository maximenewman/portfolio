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
  uniform float uPulse;     // uTime at the moment the logo was clicked

  attribute float aSeed;

  varying float vGlow;
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

    // Logo ripple: a ring that expands from the centre of the field and dies
    // out over about two seconds. uPulse starts far in the past so a fresh
    // page load has no wave in flight.
    float age = uTime - uPulse;
    if (age >= 0.0 && age < 2.5) {
      float dist = length(p.xy);
      float ring = exp(-pow(dist - age * 9.0, 2.0) * 0.22) * exp(-age * 1.4);
      p.z += ring * 3.2;
      influence = max(influence, ring);
    }

    vGlow = influence;

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

    gl_FragColor = vec4(col, alpha * uOpacity * vDepth * recede);
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

    // The nav logo fires this. Setting the uniform from an event callback is
    // fine under the compiler lint rules; only render-time mutation is not.
    const onPulse = () => {
      const material = materialRef.current
      if (material) material.uniforms.uPulse.value = material.uniforms.uTime.value
    }

    window.addEventListener("pointermove", onPointer, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("lattice-pulse", onPulse)
    onScroll()

    return () => {
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("lattice-pulse", onPulse)
    }
  }, [paused])

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
