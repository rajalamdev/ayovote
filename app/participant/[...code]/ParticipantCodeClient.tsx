"use client"
import { showAlert } from "@/app/components/Alert";
import Button from "@/app/components/Button";
import CandidateItem from "@/app/components/CandidateItem";
import Navbar from "@/app/components/Navbar";
import CountDown from "@/app/components/countdown/CountDown";
import RestrictedPage from "@/app/components/page/RestrictedPage";
import useParticipant from "@/app/lib/useParticipant";
import { useVote } from "@/app/lib/useVote";
import { CheckIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CountdownRendererFn, CountdownRenderProps } from 'react-countdown';
import { Chart } from "react-google-charts";

const STATE_NOT_STARTED: string = "STATE_NOT_STARTED";
const STATE_STARTED: string = "STATE_STARTED";
const STATE_ENDED: string = "STATE_ENDED";
const STATE_LOADING: string = "STATE_LOADING";

export default function ParticipantCodeClient({ params }: { params: { slug: string, code: string }}){
  const { data: session } = useSession();

    const getSlug = params.code[0]
    const { data, mutate:mutateVote, isLoading } = useVote(getSlug);
    const { data: participant,mutate:mutateParticipant, isLoading: participantLoading ,isError} = useParticipant(getSlug as string)
    const [currentState, setCurrentState] = useState(STATE_LOADING);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

    // console.log(participant);
    
    const submitVote = async () => {
        if (selectedCandidate) {
          showAlert({
            title: "Kamu yakin?",
            subtitle: "Kamu akan memilih " + selectedCandidate.name,
            positiveText: "Ya, saya yakin",
            negativeText: "Tidak",
            onPositiveClick: async () => {
              const res = await fetch("/api/participant/" + data?.code, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  candidate: selectedCandidate.name,
                  email: session?.user?.email,
                }),
              });
              if (res.status === 200) {
                mutateParticipant();
                mutateVote();
                showAlert({
                  title: "Vote Terkirim",
                  subtitle: "terima kasih telah berpartisipasi",
                })
              }
            },
          })
        }else{
          showAlert({
            title: "Vote Gagal ❌"  ,
            subtitle: "Pilih salah satu kandidat",
          })
        }
      };

    useEffect(() => {
        if (data) {
          // Check State by Event Time
          if (currentState === STATE_ENDED) {
            return;
          }
          const start = moment(data?.startDateTime);
          const end = moment(data?.endDateTime);
    
          const interval = setInterval(async () => {
            const now = moment();
    
            if (now.isBefore(start)) {
              setCurrentState(STATE_NOT_STARTED);
            } else if (now.isAfter(start) && now.isBefore(end)) {
              setCurrentState(STATE_STARTED);
            } else if (now.isAfter(end)) {
              setCurrentState(STATE_ENDED);
            }
          }, 1000);
    
          return () => clearInterval(interval);
        }
      }, [data]);

      useEffect(() => {
        if (data && participant) {
          const candidate = data?.candidates?.find((c: any) => c.name === participant?.candidate);
          if (candidate) {
            setSelectedCandidate(candidate);
          }
        }
      }, [participant,data]);
  
      const dataPie = [
        ["Kandidat", "Vote"],
        ...(data?.candidates ? data.candidates.map((candidate: any) => [candidate.name, candidate.votes]) : [])
      ];
      
      const options = {
        title: "Total Suara",
      };
    return (
        <>
            <Navbar />
            <main className="container mx-auto">
                <form className="flex flex-col gap-4 items-center py-20">
                    <section className="flex flex-col items-center">
                        <h2 className="text-3xl font-semibold mb-8">{data?.title}</h2>
                        <CountDown 
                            start={data?.startDateTime}
                            end={data?.endDateTime}
                            currentState={currentState}
                        />
                    </section>     
                    <section className="flex flex-col gap-4 w-1/2">
                    {!participantLoading && data?.candidates?.map((candidate: Candidate, index: number) => (
                      <div key={index}>
                        <CandidateItem
                          onClick={() => !participant && currentState === STATE_STARTED && setSelectedCandidate(candidate)}
                          isSelected={selectedCandidate?.name === candidate.name}
                          name={candidate.name}
                          key={candidate.key}
                          index={candidate.key}
                          title={"Kandidat " + candidate.key}
                          percentage={candidate.votes ? (candidate.votes / data?.totalVotes * 100) :0}
                          isMe={session?.user?.email === data?.publisher}
                        />
                      </div>
                    ))}
                    </section>
                    {(session?.user?.email != data?.publisher )&&!participant && currentState === STATE_STARTED && (
            <Button
              onClick={() => { submitVote() }}
              text="Kirim Vote Saya"
              type="primary"
              isLoading={participantLoading}
            />)}
          {/* {JSON.stringify(data?.candidates)} */}
          <div className="w-1/2 flex justify-center">
            <Chart
              chartType="PieChart"
              data={dataPie}
              options={options}
              width={"100%"}
              height={"400px"}
            />
          </div>
         {participant && <span className="bg-zinc-100 py-2 px-3">Kamu sudah memilih, dan tidak diperbolehkan untuk mengganti pilihan</span>}
         {session?.user?.email === data?.publisher && (<span className="bg-zinc-100 py-2 px-3">Pembuat vote tidak dapat melakukan voting</span>)}
                </form>
            </main>
        </>
    )
}