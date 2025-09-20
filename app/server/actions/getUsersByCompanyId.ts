import { db } from "@/lib/firebaseAdmin";

interface IParams {
  companyName?: string;
}
export async function getUsersByCompanyId(params: IParams) {
  try {
    const { companyName } = params;
    
    if (!companyName) {
      return [];
    }

    const companyQs = await db.collection('companies').where('firmanavn', '==', companyName).limit(1).get();
    const getCompanyId = companyQs.empty ? null : ({ id: companyQs.docs[0].id, ...companyQs.docs[0].data() } as any);

    if (!getCompanyId) {
      return [];
    }

    const usersQs = await db.collection('invitedUsers').where('companyId', '==', getCompanyId.id).get();
    const users = usersQs.docs.map((d) => ({ id: d.id, ...d.data() }));

    const safeUser = users.map((user: any) => ({
      ...user,
      createdAt: user.createdAt?.toDate ? user.createdAt.toDate().toISOString() : user.createdAt,
    }));

    return safeUser;
  } catch (error) {
    console.error('Error in getUsersByCompanyId:', error);
    throw error;
  }
}
