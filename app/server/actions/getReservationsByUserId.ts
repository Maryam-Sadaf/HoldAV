import { db } from "@/lib/firebaseAdmin";
import getCurrentUser from "./getCurrentUser";

interface IParams {
  userId: string;
}

export default async function getReservationByUserId(params: IParams) {
  try {
    let qs;
    
    // Try with orderBy first (requires index)
    try {
      qs = await db
        .collection('reservations')
        .where('userId', '==', params.userId)
        .orderBy('createdAt', 'desc')
        .limit(200)
        .get();
    } catch (indexError: any) {
      // Fallback: Query without orderBy if index not ready
      qs = await db
        .collection('reservations')
        .where('userId', '==', params.userId)
        .limit(200)
        .get();
    }

    const safeReservations = await Promise.all(qs.docs.map(async (doc) => {
      const data = doc.data() as any;
      const start = data.start_date?.toDate ? data.start_date.toDate() : new Date(data.start_date);
      const end = data.end_date?.toDate ? data.end_date.toDate() : new Date(data.end_date);
      const created = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : undefined);
      return {
        id: doc.id,
        roomId: data.roomId,
        roomName: data.roomName,
        companyName: data.companyName,
        start_date: start?.toISOString(),
        end_date: end?.toISOString(),
        text: data.text,
        duration: data.duration,
        createdAt: created?.toISOString(),
      } as any;
    }));

    // Sort in memory if we couldn't use orderBy
    const sortedReservations = safeReservations.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Descending order (newest first)
    });

    return sortedReservations;
  } catch (error: any) {
    console.error('Error in getReservationByUserId:', error);
    return []; // Return empty array instead of throwing
  }
}
