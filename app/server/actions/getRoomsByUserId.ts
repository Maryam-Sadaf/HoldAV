import prisma from "@/lib/prismaDB";
import getCurrentUser from "./getCurrentUser";

interface IParams {
  userId?: string;
}

export default async function getRoomsByUserId(params: IParams) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }
    const { userId } = params;
    if (!userId) {
      return;
    }
    const rooms = await prisma.room.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeRooms = rooms.map((room) => ({
      ...room,
      createdAt: room.createdAt.toISOString(),
      companyName: (room.company as any)?.[0]?.firmanavn,
    }));

    return safeRooms;
  } catch (error: any) {
    throw new Error(error);
  }
}
