import getCurrentUser from "./getCurrentUser";
import prisma from "@/lib/prismaDB";

interface IParams {
  companyName?: string;
}

export default async function getReservationByCompanyId(params: IParams) {
  try {
    const { companyName } = params;
    if (!companyName) {
      return null;
    }
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }
    const userWithCompany = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      include: {
        company: true,
      },
    });

    if (!userWithCompany) {
      return null;
    }
    const companyId = await prisma.company.findUnique({
      where: {
        firmanavn: companyName,
      },
    });
    if (!companyId) {
      throw new Error("companyId is required");
    }
    const reservation = await prisma.reservation.findMany({
      where: {
        companyId: companyId?.id,
      },
      include: {
        user: true,
      },
    });

    if (!reservation) {
      return null;
    }

    return reservation;
  } catch (error: any) {
    throw new Error(error);
  }
}
