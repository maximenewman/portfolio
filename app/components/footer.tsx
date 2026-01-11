import Link from "next/link"
import { bioData } from "./bio"

export default function Footer(){
    return (
        <div className="footer footer-horizontal justify-items-center">
            <nav>
                <h6 className="footer-title">Site</h6>
                <Link href="/experiences">Experiences</Link>
                <Link href="/projects">Projects</Link>
                <Link href="/passions">Passions</Link>
            </nav>
            <nav>
                <h6 className="footer-title">Socials</h6>
                <a href="https://github.com/maximenewman">GitHub</a>
                <a href="https://www.linkedin.com/in/maxime-newman-a546b42b5">LinkedIn</a>
                <a href={`mailto:${bioData.email}`}>Email</a>
            </nav>
            <nav>
                <h6 className="footer-title">Resume</h6>
                <a>Resume</a>
            </nav>
        </div>
    )
}