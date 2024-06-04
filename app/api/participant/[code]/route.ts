import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/app/lib/prisma";
import { generateCode } from "@/app/lib/generateCode";
import {getServerSession} from "next-auth";

export async function GET(req: Request, { params }: any){
    const session = await getServerSession()
    const code = String(params.code)
    // if (!session?.user) return new Response('Error', {status: 401})
    // console.log(session.user.email)
    const result = await prisma.participant.findFirst({
        where: {
                code: code as string,
                email: session?.user?.email!
            }
    })
    const response = {
        status: 200,
        data: result,
    }

    return Response.json(response)
}

export async function POST(req: Request, { params }: any){
    const session = await getServerSession()
    const code = String(params.code)
    // const session = await getServerSession()
    // if (session?.user) return new Response('Error', {status: 401})
    const res = await req.json()

    const result = await prisma.participant.create({
        data: {
               candidate: res.candidate,
               email: session?.user?.email!,
               code: code as string
        }
    })

    return Response.json({
        status: 200,
        message: "Success!",
        result
    })
}