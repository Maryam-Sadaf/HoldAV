import prisma from "@/lib/prismaDB";
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

    const reservations = await prisma.reservation.findMany({
      where: {
        roomId: roomId,
      },
      include: {
        room: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
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

    const safeReservations = reservations.map((reservation) => ({
      ...reservation,
      createdAt: formatDate(reservation.createdAt),
      startDate: formatDate(reservation.start_date),
      endDate: formatDate(reservation.end_date),
      room: {
        ...reservation.room,
        createdAt: formatDate(reservation.room.createdAt),
      },
    }));

    return safeReservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error; // Propagate the error so that it can be handled where this function is used.
  }
}
