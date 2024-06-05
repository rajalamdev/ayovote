import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/app/lib/prisma";
import { generateCode } from "@/app/lib/generateCode";
import {getServerSession} from "next-auth";

export async function GET(req: Request, res: Response){
    const session = await getServerSession()
    if (!session?.user) return new Response('Error', {status: 401})
    // console.log(session.user.email)
    try {
        const result = await prisma.votes.findMany({
            where: {
                AND: [
                    { deleteAt: null},
                    { publisher: session?.user?.email! },
                ]
            }
        })
        // console.log(result)
        
        const response = {
            status: 200,
            data: result,
        }
    
        return Response.json(response)

        if (!result) {
            throw new Error('Internal Server Error');
        }
    } catch (error: any) {
        return Response.json({ status: 500, message: error.message, resul: error });
    }

}

export async function POST(req: Request){
    // const session = await getServerSession()
    // if (session?.user) return new Response('Error', {status: 401})
    const res = await req.json()

    const result = await prisma.votes.create({
        data: {
            title: res.title,
            startDateTime: res.startDate,
            endDateTime: res.endDate,
            candidates: res.candidates,
            publisher: res.publisher,
            code: generateCode(6),
            deleteAt: null,
        }
    })

    return Response.json({
        status: 200,
        message: "Success!",
        result
    })
}