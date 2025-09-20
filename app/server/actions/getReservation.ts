import { db } from "@/lib/firebaseAdmin";
import getCurrentUser from "./getCurrentUser";

export async function getReservations() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }

    const qs = await db.collection('reservations').orderBy('createdAt', 'desc').get();
    const reservations = qs.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

    const safeReservation = reservations.map((reservation: any) => ({
      ...reservation,
      createdAt: reservation.createdAt?.toDate ? reservation.createdAt.toDate().toISOString() : reservation.createdAt,
    }));

    return safeReservation;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
