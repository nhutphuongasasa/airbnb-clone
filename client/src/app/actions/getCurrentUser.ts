import { getServerSession } from "next-auth/next";

// import { authOptions } from "@/pages/api/auth/[...nextauth]";

import prisma from "../../libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import axios from "axios";

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    // const session = await getSession();

    // if (!session?.user?.email) {
    //   return null;
    // }
    // //lay dud lieu trong db thong qua prisma
    // const currentUser = await prisma.user.findUnique({
    //   where: {
    //     email: session.user.email as string
    //   }
    // });

    

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


