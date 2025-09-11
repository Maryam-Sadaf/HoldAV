import prisma from "@/lib/prismaDB";
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
    const reservations = await prisma.reservation.findMany({
      where: {
        OR: [
          { roomName: convertedRoomName },
          { roomName: roomName },
          { roomName: roomName.toLowerCase() },
        ],
      },
      select: {
        id: true,
        roomId: true,
        roomName: true,
        start_date: true,
        end_date: true,
        text: true,
        duration: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      // Add pagination to prevent large datasets from slowing down queries
      take: 100, // Limit to most recent 100 reservations
    });

    // OPTIMIZED: Return raw dates without string conversion for better performance
    // Let the client handle serialization
    return reservations.map((reservation) => ({
      ...reservation,
      startDate: reservation.start_date,
      endDate: reservation.end_date,
    }));
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return []; // Return empty array instead of throwing to prevent cascade failures
  }
}
