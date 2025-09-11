import prisma from "@/lib/prismaDB";
import getCurrentUser from "./getCurrentUser";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export async function getRooms() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return;
    }
    const rooms = await prisma.room.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          include: {
            company: true,
          },
        },
      },
    });

    const safeRooms = rooms.map((room) => ({
      ...room,
      createdAt: room.createdAt.toISOString(),
      companyName: room.user?.company.map((item) => ({
        id: item?.id,
        companyName: item?.firmanavn,
      })),
    }));

    return safeRooms;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
