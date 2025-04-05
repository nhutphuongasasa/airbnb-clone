import { PrismaAdapter } from "@next-auth/prisma-adapter"; // ket noi next auth voi voi prisma
import prisma from "../../../libs/prismadb";
import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  //danh sach phuong thuc dang nhap
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    // cho phep dang nhap bang email va mat khau
    CredentialsProvider({
      name: "credentials",
      //dinh nghia cac truong dau vao
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" }
      },
      //kiem tra thong tin dang nhap
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("no information");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });
        if (!user || !user?.hashedPassword) {
          throw new Error("Not hash password or no user");
        }
        //so sanh mat khau
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        //kiem tra password
        if (!isCorrectPassword) {
          throw new Error("Incorrect password");
        }
        return user;
      }
    })
  ],
  //chi dinh trang dang nhap
  pages: {
    signIn: "/"
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt"
  },
  //chu ky bi mat
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
