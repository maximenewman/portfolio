"use client"
import Link from "next/link"
import Image from "next/image"

const Pageroutes = [
    {
        name: "Home",
        link: "/",
    },
    {
        name: "Experiences",
        link: "/experiences",
    },
    {
        name: "Projects",
        link: "/projects",
    },
    {
        name: "My Passions",
        link: "/passions",
    }
]

export default function Navbar(){
    return (
        <div className="navbar bg-green-600">
            <div className="navbar-start">
                <Image className="h-20 w-20"
                    src="/logo.png"
                    alt="Logo of Maxime"
                    width="80"
                    height="80"
                    />
            </div>
            <div className="navbar-center">
                <ul className="menu menu-horizontal px-1">
                   {Pageroutes.map((page, index) => (
                    <li key={index}>
                        <Link href={page.link}>{page.name}</Link>
                    </li>
                   
                ))}
                </ul>
            </div>
            <div className="navbar-end">

            </div>
        </div>
    )
}