import { db } from "@/lib/firebaseAdmin";
import getCurrentUser from "./getCurrentUser";

interface IParams {
  roomId?: string;
}

export default async function getReservationsByRoomId(params: IParams) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }

    const { roomId } = params;
    console.log("🚀 ~ getReservationsByRoomId ~ roomId:", roomId);

    if (!roomId) {
      throw new Error("roomId is required");
    }

    const qs = await db.collection('reservations').where('roomId', '==', roomId).orderBy('createdAt', 'desc').get();
    const reservations = qs.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    const roomSnap = await db.collection('rooms').doc(String(roomId)).get();
    const room = roomSnap.exists ? ({ id: roomSnap.id, ...roomSnap.data() } as any) : null;
    const formatDate = (inputDate: any) => {
      const formattedDate = new Date(inputDate).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });
      return formattedDate;
    };

    const safeReservations = reservations.map((reservation: any) => ({
      ...reservation,
      createdAt: formatDate(reservation.createdAt?.toDate ? reservation.createdAt.toDate() : reservation.createdAt),
      startDate: formatDate(reservation.start_date?.toDate ? reservation.start_date.toDate() : reservation.start_date),
      endDate: formatDate(reservation.end_date?.toDate ? reservation.end_date.toDate() : reservation.end_date),
      room: room ? { ...room, createdAt: formatDate(room.createdAt?.toDate ? room.createdAt.toDate() : room.createdAt) } : null,
    }));

    return safeReservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error; // Propagate the error so that it can be handled where this function is used.
  }
}
