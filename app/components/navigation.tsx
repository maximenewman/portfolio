"use client"
import Link from "next/link"

export default function Navbar(){
    return (
        <div className="navbar bg-green-600">
            <div className="navbar-start">
                {/* <Link></Link> */}
            </div>
            <div className="navbar-center">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/projects">Projects</Link>
                    </li>
                </ul>
            </div>
            <div className="navbar-end">

            </div>
        </div>
    )
}