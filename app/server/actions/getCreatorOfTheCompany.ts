import getCurrentUser from "@/app/server/actions/getCurrentUser";
import { db } from "@/lib/firebaseAdmin";

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
    const qs = await db.collection('companies').where('firmanavn', '==', convertedCompanyName).limit(1).get();
    let creator: any = qs.empty ? null : ({ id: qs.docs[0].id, ...qs.docs[0].data() } as any);

    // If that fails, try without user relation
    // In Firestore, no join; keep creator as-is
    
    return creator;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
