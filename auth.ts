import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  password: z.string().min(1).max(72).refine((value) => !bcrypt.truncates(value)),
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
        const hash = process.env.AUTH_LEADER_PASSWORD_HASH;
        if (!email || !hash) return null;

        // Check the password even for a different email to avoid a timing shortcut.
        const matches = await bcrypt.compare(parsed.data.password, hash);
        if (!matches || parsed.data.email !== email) return null;
        return { id: "ward-leader", name: "Ward leader", email };
      },
    }),
  ],
});

