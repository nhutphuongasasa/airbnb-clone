import { getServerSession } from "next-auth/next";

// import { authOptions } from "@/pages/api/auth/[...nextauth]";

// import prisma from "../../libs/prismadb";
// import { authOptions } from "@/pages/api/auth/[...nextauth]";
import axios from "axios";

export async function getSession() {
  // return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {

    const res = await axios.get(`${process.env.SERVER_URL}/api/auth/profile`,{
      withCredentials: true
    })

    const user = res.data

    const currentUser = user.user;


    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      // createdAt: currentUser.createdAt?.toISOString(),
      // updatedAt: currentUser.updatedAt?.toISOString(),
      // emailVerified: currentUser.emailVerified?.toISOString() || null
    };
  } catch (error) {
    return
  }
}


