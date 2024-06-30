import { getSession } from "@/app/lib/getSession";
import EditVoteCodeClient from "./EditVoteCodeClient";
import { redirect } from "next/navigation";

export default async function EditVote({ params }: { params: { slug: string, code: string } }){
    return (
        <>
            <EditVoteCodeClient params={params} />
        </>
    )
}