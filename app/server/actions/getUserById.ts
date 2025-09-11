import getCurrentUser from "./getCurrentUser";
import prisma from "@/lib/prismaDB";

interface IParams {
  userId?: string;
}

export default async function getUserById(params: IParams) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        company: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}
