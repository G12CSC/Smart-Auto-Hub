import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) return null;

                const ok = await bcrypt.compare(credentials.password, user.passwordHash || "");

                if (!ok) return null;

                return user;
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 60,
    },

    jwt: {
        maxAge: 30 * 60, // 30 minutes
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                
                if (user.email) {
                    const admin = await prisma.admin.findUnique({
                        where: { email: user.email }
                    });
                    
                    if (admin) {
                        token.isAdmin = true;
                        token.role = admin.role;
                    }
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string | undefined;
                session.user.isAdmin = token.isAdmin as boolean | undefined;
            }
            return session;
        },
    },
    debug: true,

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };