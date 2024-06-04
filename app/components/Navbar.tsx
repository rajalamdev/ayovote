"use client"
import { useEffect } from "react";
import Button from "./Button";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Navbar(){
    const session = useSession()

    return (
        <header>
            <nav className="container py-4 mx-auto flex justify-between">
                <h1 className="text-2xl font-semibold">AyoVote</h1>
                {session.status === "loading" && 
                    <div className="flex gap-2 items-center">
                        <div className="w-10 aspect-square rounded-full bg-[#999] animate-pulse"></div>
                        <div className="bg-[#999] w-24 h-6 rounded animate-pulse"></div>
                    </div>
                }
                {session.data && (
                    <div className="flex gap-2">
                        <img 
                            src={session?.data?.user?.image || ""} alt="profile picture" 
                            className="aspect-square rounded-full w-10"
                            />
                        <p className="font-bold mt-2">{session.data?.user?.name}</p>
                    </div>
                )}
                {session.status === "loading" && <div className="w-28 h-10 bg-[#999] animate-pulse"></div>}
                {session.data && <Button text="Logout" type="primary" className="px-8 self-start" onClick={signOut} />}    
                {!session.data && session.status === "unauthenticated" && <Button text="Login" type="primary" className="px-8" onClick={signIn} />}

            </nav>
        </header>
    )
}