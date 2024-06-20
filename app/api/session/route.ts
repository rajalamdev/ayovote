import { getServerSession } from "next-auth"

export async function GET(req: Request, res: Response){
    console.log(req)
    const session = await getServerSession()
    if (!session?.user) return new Response('Error', {status: 401})
}