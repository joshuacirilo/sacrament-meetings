import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const protectedRoute =
        nextUrl.pathname === "/meetings/new" ||
        /^\/meetings\/[^/]+\/edit\/?$/.test(nextUrl.pathname);
      return !protectedRoute || !!auth?.user;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
