import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {

    adapter: PrismaAdapter(prisma),

    providers: [

        CredentialsProvider({
            id:"user-credentials",
            name: "User Credentials",
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

                const ok = await bcrypt.compare(credentials.password, user.passwordHash);

                if (!ok) return null;

                return {
                    id: user.id,
                    email: user.email,
                    userType: "user",
                };
            },
        }),

        CredentialsProvider({
            id: "admin-credentials",
            name: "Admin Login",
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) return null;

                const admin = await prisma.admin.findUnique({
                    where: { email: credentials.email },
                });

                if (!admin) return null;

                const ok = await bcrypt.compare(credentials.password, admin.passwordHash);
                if (!ok) return null;

                return {
                    id: admin.id,
                    email: admin.email,
                    userType: "admin",
                    adminRole: admin.role,
                };
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
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

                //this function creates the jwt token for specific user type(user/admin/advisor)
                if (user) {

                    token.id = user.id;

                    // If admin credentials login, userType/adminRole will exist
                    if (user.userType === "admin") {
                        token.userType = "admin";
                        token.adminRole = user.adminRole;
                    } else {
                        // Any other login method => USER
                        token.userType = "user";
                        token.adminRole = undefined;
                    }
                }

                // IMPORTANT: OAuth logins may not provide userType later
                // Ensure default always exists:
                if (!token.userType) token.userType = "user";

                return token;


            },


            async session({ session, token }) {

                session.user.id = token.id;
                session.user.userType = token.userType;
                session.user.adminRole = token.adminRole;
                return session;
        },

        async redirect({ url,baseUrl }) {
            // Always redirect to root after login
            return process.env.BASEURL;
        },
    },

    debug: true,

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
