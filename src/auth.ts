import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        try {
          const user = await db.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          });
          console.log(user);
          if (user) {
            const isMatch: boolean = await bcrypt.compare(
              credentials.password as string,
              user.password as string,
            );

            if (isMatch) {
              return user;
            } else {
              throw new Error("Email or Password is not correct");
            }
          } else {
            throw new Error("User not found");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
});
