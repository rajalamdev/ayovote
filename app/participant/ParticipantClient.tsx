"use client"
import Image from "next/image";
import Form from "../components/Form";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import RestrictedPage from "@/app/components/page/RestrictedPage";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ParticipantClient(){
  const { data: session } = useSession();
 
    const router = useRouter();

  
  const [code, setCode] = useState("");


  const handleSubmit = async () => {
    if (code === "") {
      alert("Tolong masukkan kode yang benar");
      return;
    }
    await fetch("/api/votes/" + code, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.data)
        if (data.data.code != code) {
          alert("Kode yang anda masukkan salah");
          return;
        }
        router.push("/participant/" + code);
      });
  };

    return (
        <>
            <Navbar />
            <main className="container mx-auto flex flex-col justify-center gap-4 items-center h-[85vh]">
                <Image src={"/team-building.png"} width={250} height={250} alt="Team Building Image" />
                <h2>Ikutan Voting</h2>
                <p>Untuk ikutan voting, kamu harus memasukkan kode voting yang sudah di berikan panitia/penyelenggara</p>
                <Form value={code} onChange={(e) => setCode(e)} placeholder="Masukkan Kode Voting" title="" className="w-96" />
                <Button onClick={() => handleSubmit()} text="Lanjutkan" type="secondary" className="w-96" />
                <Button onClick={() => router.push("/")} text="Kembali" type="primary" className="w-96" />
            </main>
        </>
    )
}