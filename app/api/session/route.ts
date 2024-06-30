import { getServerSession } from "next-auth"

export async function GET(){
    const session = await getServerSession()
    if (!session?.user) return Response.json({
        status: 403,
        message: "Unauthorize",
        isLogin: false
    })
    
    return Response.json({
        status: 200,
        message: "Authorize",
        isLogin: true
    })
}