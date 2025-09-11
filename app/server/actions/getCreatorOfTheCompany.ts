import getCurrentUser from "@/app/server/actions/getCurrentUser";
import prisma from "@/lib/prismaDB";

interface IParams {
  companyName?: string;
}
export async function getCreatorByCompanyName(params: IParams) {
  try {
    const { companyName } = params;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }
    
    // Convert URL format back to company name format
    // URL: "test-company-as" -> Company name: "Test Company AS"
    const convertedCompanyName = companyName
      ?.split('-')
      .map(word => word.toUpperCase() === 'AS' ? 'AS' : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // First try to get company with user relation
    let creator: any = await prisma.company.findUnique({
      where: {
        firmanavn: convertedCompanyName,
      },
      include: { user: true },
    }).catch((error: unknown) => {
      console.warn("Error fetching creator with user relation:", error);
      return null;
    });

    // If that fails, try without user relation
    if (!creator) {
      creator = await prisma.company.findUnique({
        where: {
          firmanavn: convertedCompanyName,
        },
      }).catch((error: unknown) => {
        console.warn("Error fetching creator without user relation:", error);
        return null;
      });

      // Add null user to the result
      if (creator) {
        creator = { ...creator, user: null };
      }
    }
    
    return creator;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
