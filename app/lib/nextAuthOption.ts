// importing providers
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
export const authOption: AuthOptions = {
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
  }