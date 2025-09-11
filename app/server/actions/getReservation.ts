import prisma from "@/lib/prismaDB";
import getCurrentUser from "./getCurrentUser";

export async function getReservations() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }

    const reservations = await prisma.reservation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeReservation = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
    }));

    return safeReservation;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
