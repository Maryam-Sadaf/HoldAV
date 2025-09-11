import getCurrentUser from "@/app/server/actions/getCurrentUser";
import prisma from "@/lib/prismaDB";
interface IParams {
  companyName?: string;
  adminId?: string;
}
export async function authorizedUser(params: IParams) {
  try {
    const { companyName } = params;
    
    // Convert URL format back to company name format
    // URL: "test-company-as" -> Company name: "Test Company AS"
    const convertedCompanyName = companyName
      ?.split('-')
      .map(word => word.toUpperCase() === 'AS' ? 'AS' : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const company = await prisma.company.findUnique({
      where: {
        firmanavn: convertedCompanyName,
      },
    });

    if (!company) {
      throw new Error("companyId is required");
    }
    const users = await prisma.invitedUser.findMany({
      where: {
        companyId: company?.id,
      },
    });
    if (!users) {
      return null;
    }
    const safeUser = users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }));

    return safeUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
