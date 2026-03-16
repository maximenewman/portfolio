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
  linkedinPostUrl?: string
  media?: ProjectMedia[]
}

export const projects: Project[] = [
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
    media: [
      {
        type: "video",
        src: "https://www.youtube.com/embed/rfutVAvH3XI?si=STyJvM1nm5jhnoiY",
        alt: "Goblin's Keep gameplay demo",
        thumbnailSrc: "/titleScreenText.png",
      },
      {
        type: "video",
        src: "https://www.youtube.com/embed/odKOk1AjdDs?si=3cBbO5N8X7uaWPd8",
        alt: "LOS smart Goblin",
        thumbnailSrc: "/LOS.png",
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
    linkedinPostUrl: "https://www.linkedin.com/posts/maxime-newman-a546b42b5_i-am-happy-to-announce-that-we-won-the-first-activity-7424259085505761280-7RSu?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEu-c-ABBcothc9d0ASy0bv87_d6rpnjpcc",
    media: [
      {
        type: "image",
        src: "/doublecomputer.JPG",
        alt: "Debugging Code",
      },
      {
        type: "image",
        src: "/winning.JPEG",
        alt: "Winning the Hackathon",
      },
    ],
  },
]
