import { display_project } from "@/app/projects/components/project_display";
import { experience } from "@/app/experiences/data/experience"

export function display_experience(experiences: experience[]){
    return (
        <div className="container">
            {experiences.map( (experience, index) => (
                

            ))}

        </div>
    )
}