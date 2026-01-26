import { db } from "@/lib/firebaseAdmin";
import getCurrentUser from "./getCurrentUser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { unstable_cache } from "next/cache";
import { slugToCompanyName } from "@/utils/slugUtils";

interface IParams {
  //userId?: string;
  companyName?: string;
  requestedUserId?: string;
}

const getCachedRooms = unstable_cache(
  async (companyName: string) => {
    // Convert slug format to proper company name for database query
    const properCompanyName = slugToCompanyName(companyName);
    
    // Try multiple variations to find the company
    const variations = [
      properCompanyName,
      companyName,
      decodeURIComponent(companyName),
      companyName.replace(/-/g, ' '),
      companyName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ].filter((v, i, arr) => v && arr.indexOf(v) === i);
    
    let rooms: any[] = [];
    
    for (const variation of variations) {
      const qs = await db
        .collection('rooms')
        .where('companyName', '==', variation)
        .orderBy('createdAt', 'desc')
        .get();
      
      if (!qs.empty) {
        rooms = qs.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[];
        break;
      }
    }
    
    return rooms;
  },
  ['rooms-by-company'],
  {
    revalidate: 1, // Cache for only 1 second to ensure fresh data
    tags: ['rooms']
  }
);

export default async function getRoomsByCompanyName(params: IParams) {
  try {
    const { companyName, requestedUserId } = params;
    if (!companyName) {
      return;
    }
    
    let rooms = await getCachedRooms(companyName);

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
