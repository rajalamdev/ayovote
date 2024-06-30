import { redirect } from "next/navigation";
import { getSession } from "../lib/getSession";
import ParticipantClient from "./ParticipantClient";

export default async function Participant(){
  
  return (
    <>
      <ParticipantClient />
    </>
  )
}