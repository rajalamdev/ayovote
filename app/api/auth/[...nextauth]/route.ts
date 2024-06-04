// // imports
// import NextAuth from "next-auth"

// // importing providers
// import GoogleProvider from "next-auth/providers/google";

// const handler = NextAuth({
//     // Configure one or more authentication providers
//   pages: {
//     signIn: "/login"
//   },
//   providers: [
//     GoogleProvider({
//         clientId: String(process.env.GOOGLE_CLIENT_ID),
//         clientSecret: String(process.env.GOOGLE_CLIENT_SECRET)
//     })
//     // ...add more providers here
//   ],
//   callbacks: {
//     async session({session, token, user}: any){
//         return session
//     }
//   }
// })

// export { handler as GET, handler as POST }
// imports
import NextAuth from "next-auth"


// importing providers
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
// console.log( process.env.GITHUB_ID && String(process.env.GITHUB_ID))
const handler = NextAuth({
    pages: {
        signIn: "/login"
    },
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
          })
    ],
    callbacks: {
        session({ session, token, user }: any) {
          return session // The return type will match the one returned in `useSession()`
        },
    },
})

export { handler as GET, handler as POST }