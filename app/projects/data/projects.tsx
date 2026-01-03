export interface project {
    title: string
    description: string[]
    tech: string[]
    link: string
}

export const projects: project[] = [
    {
        title: "Goblin's Keep",
        description: [
            ` Led backend development of a 2D tile-based escape game, 
            architecting game logic and AI systems
            while coordinating code reviews and integration with teammates`,
            ` Implemented dynamic goblin AI using modified A* pathfinding 
            and randomized patrol logic,
            enhancing difficulty balance and replayability`,
            `Refactored core classes (MapGenerator, CollisionChecker, Entity) to reduce God classes, 
            eliminate duplicated code, and improve maintainability following OOP best practices.`,
            `Engineered unit and integration testing suite with JUnit and Mockito, 
            reaching 96% line coverage and 92% branch coverage to ensure code reliability`,
            `Centralized collision detection for tiles, objects, and entities, 
            improving consistency in gameplay interactions and debugging efficiency.`
        ],
        tech: [
            "Java",
            "Maven",
            "JUnit",
            "Mockito"
        ],
        link: "https://github.com/maximenewman/GoblinsKeep"
    }
]