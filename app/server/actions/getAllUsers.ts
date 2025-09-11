import getCurrentUser from "@/app/server/actions/getCurrentUser";
import prisma from "@/lib/prismaDB";

export async function getAllUsers() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeUser = users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }));

    return safeUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
