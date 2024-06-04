interface Props{
    title: string;
    placeholder: string;
    onChange: (value: string) => void;
    className?: string;
    value: string
}

export default function Form(props: Props){
    return (
        <div className="flex flex-col gap-1">
            <p className="text-sm">{props.title}</p>
            <input type="text" placeholder={props.placeholder} 
            className={`bg-zinc-100 py-2 px-4 text-gray-500 ${props.className} text-sm`} onChange={(e) => props.onChange(e.target.value)} value={props.value} />
        </div>
    )
}