import { display_experience } from "./components/display_experiences"
import { experiences } from "./data/experience"

export default function Experiences(){
    return (
        <div className="justify-items-center">
            <header>
                <h1><strong>My Experiences</strong></h1>
            </header>
            <main>
                {display_experience(experiences)}
            </main>
        </div>
    )
}