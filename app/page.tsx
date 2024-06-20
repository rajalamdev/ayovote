"use client"
// import { useSession, signIn, signOut } from "next-auth/react"

import Image from "next/image";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import { LinkIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useVotes } from "./lib/useVotes";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import moment from "moment";
import RestrictedPage from "./components/page/RestrictedPage";

export default function Home() {
  // extracting data from usesession as session
  const { data: session } = useSession()
  
  const { data: votesApi , isLoading: votesApiLoading } = useVotes();
  const [votes, setVotes] = useState<Vote[]>([])

  useEffect(() => {
    if (votesApi){
      setVotes(votesApi)
    }
  }, [votesApi])

  function deleteHandler(code: string){
    const isConfirm = confirm("Apakah anda yakin ingin menghapus data tersebut?")
    if (isConfirm){
      fetch(`/api/votes/${code}`, {
        method: "DELETE",
      }).then(() => {
          alert("Data berhasil dihapus")
          setVotes(votes?.filter((vote) => vote.code !== code));
        }).catch(() => {
          alert("Data gagal dihapus")
        })
    }
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto pb-12">
        {/* Hero Section */}
        {/* {JSON.stringify(session)} */}
        <section className="flex flex-col gap-4 w-96 items-center mx-auto pt-12 pb-20">
          <h1 className="text-4xl font-bold">Ayo Mulai Voting</h1>
          <p className="bg-zinc-100 font-medium py-2 px-4">Web Voting No.1 Di Indonesia</p>
          <Image src={"/hero.png"} width={150} height={150} alt="Hero Image" />
          <div className="flex gap-20">
            <Link 
              href={"/vote/create"}
              className="bg-black text-white rounded-sm text-sm font-medium py-2 px-4"
            >
              Buat Vote Baru
            </Link>
            <Link 
              href={"/participant"} 
              className="bg-transparet border-2 border-black text-black rounded-sm text-sm font-medium py-2 px-4"
            >
              Ikutan Vote
            </Link>
          </div>
        </section>
        {votesApiLoading && !session && (
          <>
            <div className="bg-[#999] w-full h-12 rounded animate-pulse"></div>
            <div className="bg-[#999] w-full h-12 rounded animate-pulse mt-2"></div>
            <div className="bg-[#999] w-full h-12 rounded animate-pulse mt-2"></div>
          </>
        )}
        {session && (
          <section>
            <h2 className="font-semibold">Vote yang saya buat</h2>
            <table className="w-full table-auto">
              <thead>
                <tr className="font-semibold">
                  <td className="text-left p-5 border border-zinc-200">No</td>
                  <td className="text-left p-5 border border-zinc-200">Judul</td>
                  <td className="text-left p-5 border border-zinc-200">Kandidat</td>
                  <td className="text-left p-5 border border-zinc-200">Kode</td>
                  <td className="text-left p-5 border border-zinc-200">Mulai</td>
                  <td className="text-left p-5 border border-zinc-200">Selesai</td>
                  <td className="text-left p-5 border border-zinc-200">Action</td>
                </tr>
              </thead>
              <tbody>
              {votes.length > 0 && votes && votes.map((vote: Vote, index: number) => (
                <tr className="text-sm" key={index}>
                  <td className="text-left p-5 border border-zinc-200">{index + 1}</td>
                  <td className="text-left p-5 border border-zinc-200">{vote.title}</td>
                  <td className="text-left p-5 border border-zinc-200">{vote.candidates.map((candidate) => (
                    candidate.name +
                    (index + 1 != vote.candidates.length ? " vs " : "")
                  ))}</td>
                  <td className="text-left p-5 border border-zinc-200 font-bold underline">{vote.code}</td>
                  <td className="text-left p-5 border border-zinc-200">{moment(vote.startDateTime).format('DD MMMM YYYY, h:mm:ss a')}</td>
                  <td className="text-left p-5 border border-zinc-200">{moment(vote.endDateTime).format('DD MMMM YYYY, h:mm:ss a')}</td>
                  <td className="text-left p-5 border border-zinc-200 flex gap-4 items-center">
                    <LinkIcon className="w-5" />
                    <button onClick={() => deleteHandler(vote.code)} className="">
                      <TrashIcon className="w-5" />
                    </button>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
            {!votes.length && (
              <div className="w-full border border-[#999] border-dashed flex justify-center py-4">
                <p>Belum ada vote yang anda buat!</p>
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}
