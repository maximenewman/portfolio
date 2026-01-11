import { display_project } from "@/app/projects/components/project_display";
import { experience } from "@/app/experiences/data/experience"

export function display_experience(experiences: experience[]){
    return (
        <div className="">
            {experiences.map( (experience, index) => (
                <div key={index} className="">
                    <h2><strong>Role:</strong> {experience.role}</h2>
                    <h2><strong>Company:</strong> {experience.company}</h2>
                    <h2><strong>Date:</strong> {experience.date}</h2>
                    <h2><strong>Location:</strong> {experience.location}</h2>
                    <ul key={index} className="flex flex-col pl-10">
                        {experience.projects.map((project, index) => (
                            <li key={index}>
                                {display_project(project)}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}