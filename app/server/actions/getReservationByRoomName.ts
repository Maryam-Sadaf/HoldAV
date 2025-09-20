import { db } from "@/lib/firebaseAdmin";
import getCurrentUser from "./getCurrentUser";
import { slugToRoomName } from "@/utils/slugUtils";

interface IParams {
  roomName?: string;
}

export default async function getReservationsByRoomName(params: IParams) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }

    const { roomName } = params;

    if (!roomName) {
      throw new Error("roomName is required");
    }

    // Convert URL format back to room name format using consistent utility
    // URL: "meeting-room-b" -> Room name: "Meeting Room B"
    const convertedRoomName = roomName ? slugToRoomName(roomName) : undefined;

    // OPTIMIZED: Single query with OR condition instead of 3 separate queries
    // Firestore cannot OR query across same field without composite index workaround.
    // Make three queries and merge results.
    const [qs1, qs2, qs3] = await Promise.all([
      db.collection('reservations').where('roomName', '==', convertedRoomName).orderBy('createdAt', 'desc').limit(100).get(),
      db.collection('reservations').where('roomName', '==', roomName).orderBy('createdAt', 'desc').limit(100).get(),
      db.collection('reservations').where('roomName', '==', roomName.toLowerCase()).orderBy('createdAt', 'desc').limit(100).get(),
    ]);
    const map = new Map<string, any>();
    for (const qs of [qs1, qs2, qs3]) {
      qs.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() }));
    }
    const reservations = Array.from(map.values());

    // Normalize Firestore Timestamps to ISO strings for client safety
    return reservations.map((reservation: any) => {
      const start = reservation.start_date?.toDate ? reservation.start_date.toDate() : (reservation.start_date ? new Date(reservation.start_date) : undefined);
      const end = reservation.end_date?.toDate ? reservation.end_date.toDate() : (reservation.end_date ? new Date(reservation.end_date) : undefined);
      const created = reservation.createdAt?.toDate ? reservation.createdAt.toDate() : (reservation.createdAt ? new Date(reservation.createdAt) : undefined);
      return {
        ...reservation,
        start_date: start ? start.toISOString() : undefined,
        end_date: end ? end.toISOString() : undefined,
        createdAt: created ? created.toISOString() : undefined,
        startDate: start ? start.toISOString() : undefined,
        endDate: end ? end.toISOString() : undefined,
      };
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return []; // Return empty array instead of throwing to prevent cascade failures
  }
}
