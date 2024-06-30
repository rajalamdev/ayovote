export const getSession = async () =>{
    const res = await fetch(process.env.NEXTAUTH_URL+"/api/session", {
        cache: "no-store"
        // next: {revalidate: 1}
    })
    return res.json()
}