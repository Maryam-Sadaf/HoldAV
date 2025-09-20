import getCurrentUser from "@/app/server/actions/getCurrentUser";
import { db } from "@/lib/firebaseAdmin";
import { unstable_cache } from "next/cache";

interface IParams {
  userId?: string;
}

// Cache the routes query to avoid repeated DB calls
const getCachedRoutes = unstable_cache(
  async (userId: string) => {
    const [creatorQs, invitedQs] = await Promise.all([
      db.collection('companies').where('userId', '==', userId).limit(1).get(),
      db.collection('invitedUsers').where('userId', '==', userId).limit(1).get(),
    ]);
    const creatorCompany = creatorQs.empty ? null : ({ id: creatorQs.docs[0].id, ...creatorQs.docs[0].data() } as any);
    const invitedUserData = invitedQs.empty ? null : (invitedQs.docs[0].data() as any);

    let companyData: any = null;
    if (invitedUserData?.companyId) {
      const companySnap = await db.collection('companies').doc(invitedUserData.companyId).get();
      companyData = companySnap.exists ? ({ id: companySnap.id, ...companySnap.data() } as any) : null;
    }

    return {
      creator: creatorCompany,
      company: companyData,
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
