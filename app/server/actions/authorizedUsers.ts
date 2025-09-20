import getCurrentUser from "@/app/server/actions/getCurrentUser";
import { db } from "@/lib/firebaseAdmin";
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
    
    const companyQs = await db.collection('companies').where('firmanavn', '==', convertedCompanyName).limit(1).get();
    const company = companyQs.empty ? null : ({ id: companyQs.docs[0].id, ...companyQs.docs[0].data() } as any);

    if (!company) {
      throw new Error("companyId is required");
    }
    const usersQs = await db.collection('invitedUsers').where('companyId', '==', company?.id).get();
    const users = usersQs.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    if (!users) {
      return null;
    }
    const safeUser = users.map((user: any) => ({
      ...user,
      createdAt: user.createdAt?.toDate ? user.createdAt.toDate().toISOString() : user.createdAt,
    }));

    return safeUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
