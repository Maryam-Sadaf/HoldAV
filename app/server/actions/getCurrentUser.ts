import { getServerSession } from "next-auth/next";
import { unstable_cache } from "next/cache";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prismaDB";

export async function getSession() {
  if (typeof window === "undefined") {
    return await getServerSession(authOptions);
  }

  return null;
}

// Cache user data to avoid repeated DB queries
const getCachedUser = unstable_cache(
  async (email: string) => {
    const currentUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      },
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified || null,
    };
  },
  ['current-user'],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ['user']
  }
);

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    // Use cached user lookup
    return await getCachedUser(session.user.email as string);
  } catch (error: any) {
    return null;
  }
}
