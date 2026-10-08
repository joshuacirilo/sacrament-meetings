import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  password: z.string().min(1).max(256),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const email = process.env.AUTH_LEADER_EMAIL?.trim().toLowerCase();
        const password = process.env.AUTH_LEADER_PASSWORD;
        if (!email || !password) return null;

        if (parsed.data.password !== password || parsed.data.email !== email) return null;
        return { id: "ward-leader", name: "Ward leader", email };
      },
    }),
  ],
});

