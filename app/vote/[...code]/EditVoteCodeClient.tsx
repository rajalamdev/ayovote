"use client"
import Form from "@/app/components/Form";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale/id";
import CandidateForm from "@/app/components/CandidateForm";
registerLocale("id", id);
import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useVote } from "@/app/lib/useVote";
import RestrictedPage from "@/app/components/page/RestrictedPage";
import { showAlert } from "@/app/components/Alert";

export default function EditVoteCodeClient({ params }: { params: { slug: string, code: string } }){
    const { data: session } = useSession();
   
    const getSlug = params.code[0]
    const { data: voteApi , isLoading: voteApiLoading } = useVote(getSlug);
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [title, setTitle] = useState("")
    const [loading, setLoading] = useState(false)
    
    const router = useRouter()
    
    const [candidates, setCandidates] = useState<Candidate[]>([])

    useEffect(() => {
        if (voteApi){
            setTitle(voteApi.title)
            setStartDate(new Date(voteApi.startDateTime))
            setEndDate(new Date(voteApi.endDateTime))
            setCandidates(voteApi.candidates)
            // console.log(voteApi)
        }
    }, [voteApi])

    const addCandidate = () => {
        const candidate: Candidate = {
            key: candidates.length + 1,
            name: "",
            title: ""
        }
        setCandidates([...candidates, candidate])
    }

    const submitCandidate = (candidate: Candidate) => {
        setCandidates((prevCandidates) =>
          prevCandidates.map((c) => (c.key === candidate.key ? candidate : c))
        );
    };
      

    const removeCandidateForm = (key: number) => {
        //remove candidate selected by key and re arrange the key order
        const newCandidates = candidates.filter(
          (candidate) => candidate.key !== key
        );
        newCandidates.forEach((candidate, index) => {
          candidate.key = index + 1;
        });
    
        setCandidates(newCandidates);
      };

    // useEffect(() => {
    //     console.log(candidates)
    // }, [candidates])

    const updateVote = async (e: any) => {
        e.preventDefault()
        //Validasi
        if (title === "") {
          alert("Judul tidak boleh kosong");
          return;
        }
        if (candidates.length < 2) {
          alert("Minimal ada 2 kandidat");
          return;
        }
        if (startDate > endDate) {
          alert("Tanggal mulai tidak boleh lebih besar dari tanggal selesai");
          return;
        }
        if (candidates.some((c) => c.name === "")) {
          alert("Nama Kandidat tidak boleh kosong");
          return;
        }
    
        setLoading(true);
         //Mengirim data ke API
        fetch(`/api/votes/${getSlug}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            code: getSlug,
            title,
            startDate,
            endDate,
            //candidates with no votes
            candidates: candidates.map((c) => ({
                name: c.name,
                title: c.title,
                key : c.key
            })),
            publisher: session?.user?.email,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
            showAlert({title:"Yay!",subtitle:"Vote berhasil diubah"});
            setTimeout(() => {
                router.push("/")
            }, 1000)
            });
      };

    return (
        <>
            <Navbar />
            <main className="container mx-auto py-10">
                <form onSubmit={updateVote}>
                    <section className="space-y-8">
                        <Image src={"/man-writing.png"} width={200} height={200} alt="Man Writting" />
                        <div className="space-y-4">
                            <h2 className="font-bold text-2xl">Buat Voting Baru</h2>
                            <p>Silahkan masukkan data yang dibutuhkan sebelum membuat vote online</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold">Detail Voting</h3>
                            <Form value={title} title="Judul" placeholder="Contoh: Calon Gubernur" className="w-96" onChange={(e) => setTitle(e)} />
                            <div className="flex gap-4">
                                <div>
                                    <p className="text-sm">Dimulai</p>
                                    <DatePicker
                                        locale={"id"}
                                        dateFormat="Pp"
                                        showTimeSelect
                                        selected={startDate}
                                        minDate={new Date()}
                                        onChange={(date) => date && setStartDate(date)}
                                        className="w-full border bg-zinc-100 border-transparent py-2 px-3"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm">Sampai</p>
                                    <DatePicker
                                        locale={"id"}
                                        dateFormat="Pp"
                                        showTimeSelect
                                        selected={endDate}
                                        minDate={startDate}
                                        onChange={(date) => date && setEndDate(date)}
                                        className="w-full border bg-zinc-100 border-transparent py-2 px-3"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="mt-12 mb-12">
                        <h3 className="text-xl font-semibold mb-4">Kandidat</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {candidates.map((candidate: Candidate, index: number) => (
                                <div key={index}>
                                    <CandidateForm candidate={candidate} key={candidate.key} submitCandidate={submitCandidate} removeCandidate={removeCandidateForm} />
                                </div>
                            ))}
                        <div onClick={addCandidate} className="w-1/3 flex flex-col items-center justify-center cursor-pointer bg-zinc-100 aspect-square text-zinc-400 hover:bg-zinc-900 hover:text-white">
                            <PlusIcon className="w-1/3" />
                            <span className="text-sm">Tambah</span>
                        </div>
                        </div>
                    </section>
                    <button disabled={loading} type="submit" className="bg-black text-white rounded-sm text-sm font-medium py-2 px-4">
                        {loading ? "Loading..." : "Update Vote"}
                    </button>
                </form>
            </main>
        </>
    )
}