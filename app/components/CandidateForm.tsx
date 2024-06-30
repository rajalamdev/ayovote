"use client"
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Form from "./Form";
import { XCircleIcon } from "@heroicons/react/24/solid";

interface Props {
    candidate: Candidate;
    submitCandidate?: (candidate: Candidate) => void;
    removeCandidate?: (key: number) => void;
}

const areCandidatesEqual = (candidate1: Candidate, candidate2: Candidate) => {
    return candidate1.key === candidate2.key && candidate1.name === candidate2.name && candidate1.title === candidate2.title;
};

export default function CandidateForm(props: Props){
    const [candidate, setCandidate] = useState<Candidate>({
        key: 0,
        name: "",
        title: "",
    });

    const [debouncedCandidate, setDebouncedCandidate] = useState(candidate);

    useDebounce(
        () => {
            setDebouncedCandidate(candidate);
        },
        300,
        [candidate]
    );

    useEffect(() => {
        if (!areCandidatesEqual(candidate, props.candidate)) {
            setCandidate(props.candidate);
        }
    }, [props.candidate]);

    useEffect(() => {
        if (props.submitCandidate && !areCandidatesEqual(debouncedCandidate, props.candidate)) {
            props.submitCandidate(debouncedCandidate);
        }
    }, [debouncedCandidate]);

    return <div className="border border-zinc-100 flex flex-col justify-center gap-4 items-center p-4 rounded-sm">
        <div className="self-end">
          <XCircleIcon
            className="h-6 w-6 cursor-pointer hover:bg-zinc-100 text-zinc-300"
            onClick={() =>  props.removeCandidate && props.removeCandidate(candidate.key)}
          />
        </div>
        <div className="bg-zinc-200 aspect-square rounded-full w-1/2 grid place-items-center text-xl">{props.candidate.key}</div>
          <Form placeholder="Masukkan nama kandidat" title="Nama Kandidat" value={candidate.name}
          className="w-full" 
          onChange={(e) => {
            setCandidate({ ...candidate, name: e });
          }} />
        </div>
}