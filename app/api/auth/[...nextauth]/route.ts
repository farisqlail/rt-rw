import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { createClient } from "@supabase/supabase-js"
import type { NextAuthOptions } from "next-auth"
import bcrypt from "bcryptjs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
)

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }),

  providers: [
    CredentialsProvider({
      name: "Email dan Password",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@rtrw.id" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const { data: user, error } = await supabase
          .from("rtrw_users")
          .select("*")
          .eq("email", credentials.email)
          .single()

        if (error || !user) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as string
        token.id = user.id as string
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
