export interface ProjectMedia {
  type: "image" | "video"
  src: string
  alt?: string
  thumbnailSrc?: string
}

export interface Project {
  title: string
  description: string[]
  tech: string[]
  link: string
  playUrl?: string
  linkedinPostUrl?: string
  media?: ProjectMedia[]
}

export const projects: Project[] = [
  {
    title: "AutoSec",
    description: [
      `Contributing to an agentic security pipeline that autonomously detects, exploits, patches, and verifies software vulnerabilities using LLMs.`,
      `Primary owner of end-to-end pipeline runs across 120 Java projects from CWE-Bench-Java, producing the scans, exploits, and patches behind the paper's evaluation.`,
      `Improved pipeline reliability to run unattended across the full 120-project benchmark by adding graceful fallback that reuses cached scan results and runs fresh analysis otherwise, eliminating prior startup failures.`,
      `Documenting the work as a formal research manuscript intended for submission to the ACM Conference on Computer and Communications Security (CCS), emphasizing system reliability, verification, and auditability.`,
    ],
    tech: ["Python", "Java", "LangGraph", "LLM Agents", "CodeQL", "Static Analysis"],
    link: "https://github.com/KoushaAm/AutoSec",
    media: [
      {
        type: "image",
        src: "/projects/autosec/Autosec-thumbnail.png",
        alt: "AutoSec agentic security pipeline",
      },
    ],
  },
  {
    title: "GreenLeaf Lending Analytics",
    description: [
      `Built an interactive dashboard scoring loan readiness 0-100 from 25K+ sensor readings across 8 B.C. farms, letting RBC lenders stress-test approval scenarios live.`,
      `Quantified a $47K seasonal return on 4.6% of input spend, giving lenders a concrete margin-of-safety figure to underwrite against.`,
      `Linked same-day alert response to 4.2× more crop stress relieved, tying operational discipline to measurable loan risk.`,
    ],
    tech: ["React", "JavaScript", "SVG", "CSS", "Data Analysis"],
    link: "https://github.com/maximenewman/GreenLeaf-Lending-Analytics",
    media: [
      {
        type: "video",
        src: "https://github.com/user-attachments/assets/d302b062-2bf6-46a1-8de8-c222809ae3d4",
        alt: "GreenLeaf loan-readiness dashboard demo",
        thumbnailSrc: "/projects/greenleaf/greenleaf-thumbnail.png",
      },
    ],
  },
  {
    title: "Goblin's Keep",
    description: [
      `Led backend development of a 2D tile-based escape game by architecting game logic and AI systems, coordinating code reviews and integration across a team of developers.`,
      `Implemented dynamic goblin AI using a modified A* pathfinding algorithm with randomized patrol logic, enhancing difficulty balance and replayability.`,
      `Refactored core classes (MapGenerator, CollisionChecker, Entity) to eliminate God classes and duplicated code, improving long-term maintainability following OOP best practices.`,
      `Engineered a unit and integration testing suite with JUnit and Mockito, achieving 96% line coverage and 92% branch coverage to ensure correctness across all gameplay interactions.`,
    ],
    tech: ["Java", "Maven", "JUnit", "Mockito"],
    link: "https://github.com/maximenewman/GoblinsKeep",
    playUrl: "/goblinskeep",
    media: [
      {
        type: "video",
        src: "https://www.youtube.com/embed/rfutVAvH3XI?si=STyJvM1nm5jhnoiY",
        alt: "Goblin's Keep gameplay demo",
        thumbnailSrc: "/projects/goblinskeep/titleScreenText.png",
      },
      {
        type: "video",
        src: "https://www.youtube.com/embed/odKOk1AjdDs?si=3cBbO5N8X7uaWPd8",
        alt: "LOS smart Goblin",
        thumbnailSrc: "/projects/goblinskeep/LOS.png",
      },
    ],
  },
  {
    title: "SFU DSSS ML Hackathon - 1st Place",
    description: [
      `Won the first ML Hackathon hosted by the SFU Data Science Student Society by building a multi-class fraud detection pipeline for fraud detection.`,
      `Designed a validation and cleaning pipeline enforcing consistent data types and value ranges, applying constraint-based reasoning to flag real-world transaction impossibilities.`,
      `Engineered three predictive features: balance mismatch flag, balance difference (after minus before), and balance error (amount minus balance difference) to expose accounting inconsistencies for the model.`,
      `Trained a class-weighted Random Forest over a logistic regression baseline, tuning number of trees, max depth, and minimum samples against Macro F1 to improve recall on rare minority fraud classes.`,
    ],
    tech: ["Python", "Scikit-learn", "Pandas", "NumPy"],
    link: "https://github.com/dshak1/hackML",
    linkedinPostUrl: "https://www.linkedin.com/posts/maxime-newman-nereyabagabo-a546b42b5_i-am-happy-to-announce-that-we-won-the-first-ugcPost-7424256215029055488-Dsj1?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEu-c-ABBcothc9d0ASy0bv87_d6rpnjpcc",
    media: [
      {
        type: "image",
        src: "/projects/dsss-hackathon/doublecomputer.JPG",
        alt: "Debugging Code",
      },
      {
        type: "image",
        src: "/projects/dsss-hackathon/winning.JPEG",
        alt: "Winning the Hackathon",
      },
    ],
  },
]
