import { zeroPad } from "react-countdown";

interface Props {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface PropsItem{
    label: string;
    value: string;
}

function CountdownItem(props: PropsItem){
    return <div className="flex">
        <div className="flex flex-col items-center">
            <p className="text-3xl font-bold">{props.value}</p>
            <p>{props.label}</p>
        </div>
        {props.label !== "Detik" && (
            <div className="mx-3 text-xl">:</div>
        )}
    </div>
}

export default function CountdownRenderer(props: Props){
    return (
        <div className="flex">
            <CountdownItem label="Hari" value={zeroPad(props.days)} />
            <CountdownItem label="Jam" value={zeroPad(props.hours)} />
            <CountdownItem label="Menit" value={zeroPad(props.minutes)} />
            <CountdownItem label="Detik" value={zeroPad(props.seconds)} />
        </div>
    )
}