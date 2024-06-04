"use client"
import Button from "../components/Button";
import { getProviders, signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";

export default function Login(){
  const { data: session } = useSession()
  const router = useRouter()

  if (session){
    router.push("/")
  }

    return <main className="container mx-auto h-screen flex flex-col items-center justify-center gap-8">
        <h2 className="text-3xl font-semibold">AyoVote</h2>
        <div >
          <button className="bg-transparet border-2 border-black text-black 
        rounded-sm text-sm font-medium py-2 px-4" onClick={(e) => {
          signIn('google')
        }}>
            Sign in with Google
          </button>
          {/* <button className="bg-transparet border-2 border-black text-black 
        rounded-sm text-sm font-medium py-2 px-4" onClick={(e) => {
          signIn('github')
        }}>
            Sign in with Github
          </button> */}
        </div>
    </main>
}