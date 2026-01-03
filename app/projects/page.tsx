import { project, projects} from "./data/projects"

export default function Portfoliorojects() {
    return (
        <div className="container">
            <div></div>

            <div className="flex items-center justify-center">
                {projects.map((project, index) => (
                    <div key={index} className="py-5">
                        <h1><strong>{project.title}</strong></h1>

                        <h2><strong>Description</strong></h2>
                        <ul>
                            {project.description.map((desc, i) => (
                                <li key={i}>{desc}</li>
                            ))}
                        </ul>

                        <h2><strong>Technologies</strong></h2>
                        <ul>
                            {project.description.map((tech, i) => (
                                <li key={i}>{tech}</li>
                            ))}
                        </ul>
                        
                        <a href={project.link}><strong>View Project</strong></a>

                    </div>
                ))}
            </div>
        </div>
    )
}