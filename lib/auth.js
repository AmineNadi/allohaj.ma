import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";


import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "البريد الإلكتروني", type: "email" },
          password: { label: "كلمة المرور", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("البريد الإلكتروني وكلمة المرور مطلوبة");
          }
  
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
  
          if (!user) {
            throw new Error("المستخدم غير موجود");
          }
  
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
  
          if (!isValidPassword) {
            throw new Error("كلمة المرور غير صحيحة");
          }
  
          return user;
        },
      }),
    ],
  
    pages: {
      signIn: "/login",
      error: "/auth/error",
    },
  
    session: {
      strategy: "jwt",
    },
  
    callbacks: {
      // ✅ إضافة دعم للـ role والـ id داخل jwt
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
        return token;
      },
  
      // ✅ نقل المعلومات من token إلى session
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id;
          session.user.role = token.role;
        }
        return session;
      },
    },
  
    debug: process.env.NODE_ENV === "development",
  };
  
