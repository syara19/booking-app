import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { comparePassword } from "./hashPassword";



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "mail@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },include:{
            customer: true,
            admin: true
          }
        });

        if (!user) {
          return null;
        }

        const isValid = await comparePassword(
          credentials!.password,
          user.password
        );
        if (!isValid) {
          return null;
        }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            customerId: user.customer?.id || null, 
            adminId: user.admin?.id || null,     
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        if ('role' in user) {
          token.role = user.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if(token){
        session.user = session.user ?? {};
        session.user.email = token.email;
        session.user.role = token.role;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

