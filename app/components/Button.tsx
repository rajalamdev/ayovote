"use client"
interface Props {
    text: string;
    type?: "primary" | "secondary";
    className?: string;
    onClick?: () => void;
    isLoading?: boolean;
}

export default function Button(props: Props){
    return <button 
        disabled={props.isLoading}
        className={`${props.type === "primary" ? "bg-black text-white" : "bg-transparet border-2 border-black text-black"} 
        rounded-sm text-sm font-medium py-2 px-4 ${props.className} ${props.isLoading && "cursor-not-allowed opacity-50"}`}
        onClick={(e) => {
            e.preventDefault();
            props.onClick && props.onClick();
        }}
    >
        {props.isLoading ? "Loading..." : props.text}
    
    </button>
}