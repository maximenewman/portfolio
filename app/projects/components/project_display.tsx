import { project } from "@/app/projects/data/projects"

// export function display_project(projects: project[]){
//     return (
//         <div className="container">
//             <div className="flex flex-wrap items-center justify-center">
//                 {projects.map((project, index) => (
//                     <div key={index} className="my-5">
//                         <h1><strong>{project.title}</strong></h1>
                        
//                         <h2><strong>Description</strong></h2>
//                         <ul className="list-disc list-inside">
//                             {project.description.map((desc, i) => (
//                                 <li key={i}>{desc}</li>
//                             ))}
//                         </ul>

//                         <h2><strong>Technologies</strong></h2>
//                         <ul className="list-disc list-inside">
//                             {project.tech.map((tech, i) => (
//                                 <li key={i}>{tech}</li>
//                             ))}
//                         </ul>
                        
//                         <a href={project.link}><strong>View Project</strong></a>

//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }
export function display_project(proj: project){
    return (
        <div className="my-5">
            <h1><strong>{proj.title}</strong></h1>
            
            <h2><strong>Description</strong></h2>
            <ul className="list-disc list-inside">
                {proj.description?.map((desc, i) => (
                    <li key={i}>{desc}</li>
                ))}
            </ul>

            <h2><strong>Technologies</strong></h2>
            <ul className="list-disc list-inside">
                {proj.tech?.map((tech, i) => (
                    <li key={i}>{tech}</li>
                ))}
            </ul>
            
            <a href={proj.link}><strong>View Project</strong></a>
        </div>
    )
}