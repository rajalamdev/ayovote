"use client"
import { useEffect, useState } from "react";
import Form from "./Form";

interface Props {
    candidate: Candidate;
    submitCandidate?: (candidate: Candidate) => void;
    removeCandidate?: (key: number) => void;
}

export default function CandidateForm(props: Props){
    const [candidate, setCandidate] = useState<Candidate>({
        key: 0,
        name: "",
        title: "",
      });
    
      useEffect(() => {
        if (candidate !== props.candidate) {
          setCandidate(props.candidate);
        }
      }, [props.candidate]);
    
      useEffect(() => {
        if (props.submitCandidate && candidate !== props.candidate) {
          props.submitCandidate(candidate);
        }
      }, [candidate]);
    

    return <div className="border border-zinc-100 flex flex-col justify-center gap-4 items-center p-4 rounded-sm">
        <div className="bg-zinc-200 aspect-square rounded-full w-1/2 grid place-items-center text-xl">{props.candidate.key}</div>
        <Form placeholder="Masukkan nama kandidat" title="Nama Kandidat" value={candidate.name}
        className="w-full" 
        onChange={(e) => {
          setCandidate({ ...candidate, name: e });
        }} />
    </div>
}