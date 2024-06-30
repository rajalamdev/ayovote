import CreateVoteClient from "./CreateClient";
import { redirect } from "next/navigation";

export default async function CreateVote() {

    // if (!data.isLogin){
    //     redirect("/restricted")
    // }

    return (
        <>
            <CreateVoteClient />
        </>
    )
}