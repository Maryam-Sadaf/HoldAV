import { db } from "@/lib/firebaseAdmin";
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
    const qs = await db
      .collection('rooms')
      .where('companyName', '==', companyName)
      .orderBy('createdAt', 'desc')
      .get();
    return qs.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[];
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

    const safeRooms = rooms.map((room: any) => ({
      ...room,
      createdAt: room.createdAt?.toDate ? room.createdAt.toDate().toISOString() : room.createdAt,
      companyName: companyName,
    }));

    return safeRooms;
  } catch (error: any) {
    console.error('Error in getRoomsByCompanyName:', error);
    throw new Error(error.message || error);
  }
}
