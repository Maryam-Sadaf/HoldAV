import prisma from "@/lib/prismaDB";
import getCurrentUser from "./getCurrentUser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { unstable_cache } from "next/cache";

interface IParams {
  //userId?: string;
  companyName?: string;
}

const getCachedRooms = unstable_cache(
  async (companyName: string) => {
    return await prisma.room.findMany({
      where: {
        companyName: companyName,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        companyName: true,
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  ['rooms-by-company'],
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ['rooms']
  }
);

export default async function getRoomsByCompanyName(params: IParams) {
  try {
    const { companyName } = params;
    if (!companyName) {
      return;
    }
    
    const rooms = await getCachedRooms(companyName);

    const safeRooms = rooms.map((room) => ({
      ...room,
      createdAt: room.createdAt instanceof Date ? room.createdAt.toISOString() : room.createdAt,
      companyName: companyName,
    }));

    return safeRooms;
  } catch (error: any) {
    console.error('Error in getRoomsByCompanyName:', error);
    throw new Error(error.message || error);
  }
}
