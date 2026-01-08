import { projects} from "./data/projects"
import { display_project } from "./components/project_display"

export default function Portfoliorojects() {
    return (
        display_project(projects)
    )
}