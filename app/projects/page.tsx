import { projects} from "./data/projects"
import { display_project } from "./components/project_display"

export default function Portfoliorojects() {
    return (
        <div className="justify-items-center">
            <header>
                <h1><strong>My Projects</strong></h1>
            </header>
            <main>
                {display_project(projects)}
            </main>
        </div>
    )
}