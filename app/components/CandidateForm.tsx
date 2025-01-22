"use client"
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Form from "./Form";
import { XCircleIcon, PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

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
        image: "",
    });
    const [uploading, setUploading] = useState(false);

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.url) {
                setCandidate({ ...candidate, image: data.url });
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    return <div className="border border-zinc-100 flex flex-col justify-center gap-4 items-center p-4 rounded-sm">
        <div className="self-end">
          <XCircleIcon
            className="h-6 w-6 cursor-pointer hover:bg-zinc-100 text-zinc-300"
            onClick={() =>  props.removeCandidate && props.removeCandidate(candidate.key)}
          />
        </div>
        <div className="relative w-32 h-32 group">
            {candidate.image ? (
                <Image
                    src={candidate.image}
                    alt={candidate.name}
                    fill
                    className="object-cover rounded-full"
                />
            ) : (
                <div className="bg-zinc-200 group-hover:bg-zinc-400 w-full h-full rounded-full flex items-center justify-center">
                    <PhotoIcon className="w-8 h-8 text-zinc-400 group-hover:text-zinc-600" />
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploading}
            />
        </div>
        <Form placeholder="Masukkan nama kandidat" title="Nama Kandidat" value={candidate.name}
        className="w-full" 
        onChange={(e) => {
          setCandidate({ ...candidate, name: e });
        }} />
    </div>
}