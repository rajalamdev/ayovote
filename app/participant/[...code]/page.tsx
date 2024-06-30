import { getServerSession } from "next-auth";
import ParticipantCodeClient from "./ParticipantCodeClient";
import { authOption } from "@/app/lib/nextAuthOption";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/getSession";

// const getSession = async () =>{
//     const res = await fetch(process.env.NEXTAUTH_URL+"/api/session")
//     return res.json()
// }

export default async function Code({ params }: { params: { slug: string, code: string }}){
  return (
    <>
      <ParticipantCodeClient params={params} />
    </>
  )
}