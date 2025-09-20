import { db } from "@/lib/firebaseAdmin";
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
    const qs = await db.collection('rooms').where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    const rooms = qs.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    const safeRooms = rooms.map((room: any) => ({
      ...room,
      createdAt: room.createdAt?.toDate ? room.createdAt.toDate().toISOString() : room.createdAt,
      companyName: room.companyName,
    }));

    return safeRooms;
  } catch (error: any) {
    throw new Error(error);
  }
}
