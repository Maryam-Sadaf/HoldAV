import getCurrentUser from "./getCurrentUser";
import prisma from "@/lib/prismaDB";

interface IParams {
  companyName?: string;
}

export default async function getReservationByCompanyName(params: IParams) {
  try {
    const { companyName } = params;

    if (!companyName) {
      return [];
    }

    // Convert URL format back to company name format
    // URL: "test-company-as" -> Company name: "Test Company AS"
    const convertedCompanyName = companyName
      ?.split('-')
      .map(word => word.toUpperCase() === 'AS' ? 'AS' : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // OPTIMIZED: Use indexed query with pagination for better performance
    const reservations = await prisma.reservation.findMany({
      where: {
        companyName: convertedCompanyName,
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
        userId: true,
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      // PERFORMANCE: Limit results for company queries (can be large)
      take: 500, // Higher limit for company-wide queries
    });

    if (!reservations || reservations.length === 0) {
      return [];
    }

    // OPTIMIZED: Batch process date serialization
    const safeReservations = reservations.map((reservation) => {
      const startDateISO = reservation.start_date.toISOString();
      const endDateISO = reservation.end_date.toISOString();
      const createdAtISO = reservation.createdAt.toISOString();
      
      return {
        ...reservation,
        createdAt: createdAtISO,
        start_date: startDateISO,
        end_date: endDateISO,
      };
    });

    return safeReservations;
  } catch (error: any) {
    console.error('Error in getReservationByCompanyName:', error);
    return []; // Return empty array instead of throwing
  }
}
