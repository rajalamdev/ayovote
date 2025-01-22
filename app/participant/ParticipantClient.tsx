"use client"
import Image from "next/image";
import Form from "../components/Form";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ParticipantClient(){
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    setLoading(true)
    if (code === "") {
      toast.error("Tolong masukkan kode yang benar", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch("/api/votes/" + code);
      const data = await res.json();

      console.log(data)
      if (data?.data?.code != code || !data.data) {
        toast.error("Kode yang anda masukkan salah", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
      toast.success("Kode ditemukan! Mengalihkan...", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      router.push("/participant/" + code);
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className="container mx-auto flex flex-col justify-center gap-4 items-center h-[85vh]">
        <Image src={"/team-building.png"} width={250} height={250} alt="Team Building Image" />
        <h2>Ikutan Voting</h2>
        <p>Untuk ikutan voting, kamu harus memasukkan kode voting yang sudah di berikan panitia/penyelenggara</p>
        <Form value={code} onChange={(e) => setCode(e)} placeholder="Masukkan Kode Voting" title="" className="w-96" />
        <Button isLoading={loading} onClick={() => handleSubmit()} text="Lanjutkan" type="secondary" className="w-96" />
        <Button onClick={() => router.push("/")} text="Kembali" type="primary" className="w-96" />
      </main>
    </>
  )
}