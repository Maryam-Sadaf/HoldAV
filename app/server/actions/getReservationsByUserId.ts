import prisma from "@/lib/prismaDB";
import getCurrentUser from "./getCurrentUser";

interface IParams {
  userId: string;
}

export default async function getReservationByUserId(params: IParams) {
  try {
    // OPTIMIZED: Use indexed query with pagination
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: params.userId,
      },
      select: {
        id: true,
        roomId: true,
        roomName: true,
        companyName: true,
        start_date: true,
        end_date: true,
        text: true,
        duration: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            companyName: true,
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      // PERFORMANCE: Limit results to prevent large payloads
      take: 200, // Reasonable limit for user reservations
    });

    // OPTIMIZED: Batch serialize dates for better performance
    const safeReservations = reservations.map((reservation) => {
      const startDateISO = reservation.start_date.toISOString();
      const endDateISO = reservation.end_date.toISOString();
      const createdAtISO = reservation.createdAt.toISOString();
      
      return {
        ...reservation,
        createdAt: createdAtISO,
        start_date: startDateISO,
        end_date: endDateISO,
        startDate: startDateISO,
        endDate: endDateISO,
      };
    });

    return safeReservations;
  } catch (error: any) {
    console.error('Error in getReservationByUserId:', error);
    return []; // Return empty array instead of throwing
  }
}
