import getCurrentUser from "@/app/server/actions/getCurrentUser";
import prisma from "@/lib/prismaDB";
import { unstable_cache } from "next/cache";

interface IParams {
  userId?: string;
}

// Cache the routes query to avoid repeated DB calls
const getCachedRoutes = unstable_cache(
  async (userId: string) => {
    // Single optimized query with join to get both creator and company data
    const [creatorCompany, invitedUserData] = await Promise.all([
      // Check if user is a creator (company owner)
      prisma.company.findFirst({
        where: { userId: userId },
        select: {
          id: true,
          firmanavn: true,
          userId: true,
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            }
          }
        },
      }),
      // Check if user is an invited user
      prisma.invitedUser.findUnique({
        where: { userId: userId },
        select: {
          companyId: true,
        }
      })
    ]);

    // Performance: If user is invited, get the company data (this could be optimized further)
    let companyData = null;
    if (invitedUserData?.companyId) {
      companyData = await prisma.company.findUnique({
        where: { id: invitedUserData.companyId },
        select: {
          id: true,
          firmanavn: true,
          userId: true,
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            }
          }
        },
      });
    }

    return {
      creator: creatorCompany,
      company: companyData
    };
  },
  ['user-routes'],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ['user-routes']
  }
);

export async function getRoutesByCurrentUser(params: IParams) {
  try {
    const currentUser = await getCurrentUser();
    const { userId } = params;

    if (!currentUser) {
      return { creator: null, company: null };
    }

    // Use cached query with the user ID or current user ID
    const targetUserId = userId || currentUser.id;
    const routes = await getCachedRoutes(targetUserId);

    return routes;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
