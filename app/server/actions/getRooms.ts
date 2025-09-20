import { db } from "@/lib/firebaseAdmin";
import getCurrentUser from "./getCurrentUser";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export async function getRooms() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return;
    }
    const qs = await db.collection('rooms').orderBy('createdAt', 'desc').get();
    const rooms = qs.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

    const safeRooms = rooms.map((room: any) => ({
      ...room,
      createdAt: room.createdAt?.toDate ? room.createdAt.toDate().toISOString() : room.createdAt,
    }));

    return safeRooms;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
