import { AuthOptions } from "next-auth";
import prisma from "@/lib/prismaDB";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import { getSession, signOut } from "next-auth/react";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  ...( { trustHost: true } as any ),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        const user = await prisma?.user?.findUnique({
          where: {
            email: credentials?.email,
          },
        });
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }
        const isCorrectedPassword = await bcrypt.compare(
          credentials?.password,
          user.hashedPassword
        );
        if (!isCorrectedPassword) {
          throw new Error("Incorrect Password");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },

  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    // maxAge: 3600,
  },
  // jwt: {
  //   maxAge: 3600,
  // },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger == "update") {
        return { ...token, ...session.user };
      }

      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
