import prisma from "@/lib/prismaDB";

interface IParams {
  companyName?: string;
}
export async function getUsersByCompanyId(params: IParams) {
  try {
    const { companyName } = params;
    
    if (!companyName) {
      console.log('getUsersByCompanyId: No company name provided');
      return [];
    }

    console.log('getUsersByCompanyId: Looking for company:', companyName);

    const getCompanyId = await prisma.company.findUnique({
      where: {
        firmanavn: companyName,
      },
    });

    if (!getCompanyId) {
      console.log('getUsersByCompanyId: Company not found:', companyName);
      return [];
    }

    console.log('getUsersByCompanyId: Found company ID:', getCompanyId.id);

    const users = await prisma.invitedUser.findMany({
      where: {
        companyId: getCompanyId.id,
      },
    });

    console.log('getUsersByCompanyId: Found users count:', users.length);

    const safeUser = users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }));

    return safeUser;
  } catch (error) {
    console.error('Error in getUsersByCompanyId:', error);
    throw error;
  }
}
