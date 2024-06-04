import { prisma } from "@/app/lib/prisma" 

export async function GET(req: Request, { params }: any ){
    const code = String(params.code)
    const votes = await prisma.votes.findFirst({
        select:{
            id: true,
            publisher: true,
            title: true,
            code: true,
            startDateTime: true,
            endDateTime: true,
            candidates: true,
            createdAt: true,
            deleteAt: false
        },
        where: {
            code: code as string,
            deleteAt: null
        }
    })

    // Get Participants of the Vote
    const participants = await prisma.participant.findMany({
        select:{
            candidate:true,
            email: true,
            participateAt: true,
        },
        where: {
            code: code as string,
        }
    })

    //Count Vote for each Candidate
    var candidates : Candidate[] = []; 
    if(participants){
        candidates = votes?.candidates.map(candidate => { 
            const votes = participants.filter(participant => participant.candidate === candidate.name).length || 0;
            return {
                ...candidate,
                votes
            }
        }) as Candidate[]
    }

const result = {
        id: votes?.id,
        publisher: votes?.publisher,
        title: votes?.title,
        code: votes?.code,
        candidates: candidates,
        startDateTime: String(votes?.startDateTime),
        endDateTime: String(votes?.endDateTime),
        createdAt: String(votes?.createdAt),
        totalVotes: candidates ? candidates?.reduce((acc, candidate) => acc + (candidate.votes ? candidate.votes :0), 0) : 0
    } as Votes;

    const response = {
        status: 200,
        data: result,
    }

    // return res.json(result)
    return Response.json({
        message: "Success",
        votes: response
    })
}

export async function DELETE(req: Request, { params }: any ){
    const code = String(params.code)
    const result = await prisma.votes.update({
        where: {
            code: code
        },
        data: {
            deleteAt: new Date().toString()
        }
    })
    // return res.json(result)
    return Response.json({
        message: "Success",
        result
    })
}

export async function PUT(req: Request, { params }: any ){
    const res = await req.json()
    const code = String(params.code)
    const result = await prisma.votes.update({
        where: {
            code: code
        },
        data: {
            candidates: res.candidates,
            endDateTime: res.endDate,
            startDateTime: res.startDate,
            title: res.title
        }
    })
    // return res.json(result)
    return Response.json({
        message: "Success",
        result
    })
}