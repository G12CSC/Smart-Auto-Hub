import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      id: "user-credentials",
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

        const ok = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
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

        const ok = await bcrypt.compare(
          credentials.password,
          admin.passwordHash,
        );

        if (!ok) return null;

        console.log("LOGIN ATTEMPT:", credentials);

        return {
          id: admin.id,
          email: admin.email,
          userType: admin.role === "advisor" ? "advisor" : "admin",
          adminRole: admin.role,
          mustChangePassword: admin.mustChangePassword,
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
    // async jwt({ token, user }) {
    //     if (user) {
    //         token.id = user.id;
    //         token.userType = user.userType;
    //         token.name = user.name;
    //         token.adminRole = user.adminRole ?? null;
    //         token.mustChangePassword = user.mustChangePassword ?? false;
    //     }
    //
    //     if (!token.userType) token.userType = "user";
    //
    //     return token;
    // },
    //
    // async session({ session, token }) {
    //     session.user.id = token.id;
    //     session.user.userType = token.userType;
    //     session.user.name = token.name;
    //     session.user.adminRole = token.adminRole;
    //     session.user.mustChangePassword = token.mustChangePassword;
    //     return session;
    // },
    //
    // async redirect({ url, baseUrl }) {
    //     return process.env.BASEURL;
    // },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.adminRole = user.adminRole ?? null;

        // 🔥 KEY FIX
        if (account?.provider === "google" || account?.provider === "github") {
          token.userType = "user"; // ✅ assign role for OAuth users
        } else {
          token.userType = user.userType ?? "user";
        }
      }

      // Apply client-side session.update(...) payload immediately.
      // Only allow updating display name — never trust client-provided email.
      if (trigger === "update" && session) {
        if (typeof session.name === "string") {
          token.name = session.name;
        }
      }

      // 🔥 ALWAYS GET LATEST VALUE FROM DB
      if (token.userType === "advisor" || token.userType === "admin") {
        const admin = await prisma.admin.findUnique({
          where: { id: token.id },
        });

        if (admin) {
          token.mustChangePassword = admin.mustChangePassword;
          token.name = admin.name;
          token.email = admin.email;
        }
      } else if (token.userType === "user" && token.id) {
        const user = await prisma.user.findUnique({
          where: { id: token.id },
          select: { email: true },
        });

        if (user) {
          token.email = user.email;
        } else {
          console.warn(`JWT: no user found for id=${token.id}; token may be stale`);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.userType = token.userType ?? "user";
      session.user.name = token.name;
      session.user.adminRole = token.adminRole;
      session.user.mustChangePassword = token.mustChangePassword;
      session.user.email = token.email; // ✅ IMPORTANT
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return baseUrl + url;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },

  debug: true,

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
