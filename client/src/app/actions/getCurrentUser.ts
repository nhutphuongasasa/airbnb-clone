import { getServerSession } from "next-auth/next";

// import { authOptions } from "@/pages/api/auth/[...nextauth]";

import prisma from "../../libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }
    //lay dud lieu trong db thong qua prisma
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string
      }
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt?.toISOString(),
      updatedAt: currentUser.updatedAt?.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null
    };
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    throw new Error("Error in get CurrentSession");
  }
}
