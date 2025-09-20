import getCurrentUser from "./getCurrentUser";
import { db } from "@/lib/firebaseAdmin";

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
    // Firestore: skip join, not used later
    const userWithCompany = { id: currentUser.id } as any;

    if (!userWithCompany) {
      return null;
    }
    const companyQs = await db.collection('companies').where('firmanavn', '==', companyName).limit(1).get();
    const companyId = companyQs.empty ? null : ({ id: companyQs.docs[0].id, ...companyQs.docs[0].data() } as any);
    if (!companyId) {
      throw new Error("companyId is required");
    }
    const qs = await db.collection('reservations').where('companyId', '==', companyId?.id).get();
    const reservation = qs.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

    if (!reservation) {
      return null;
    }

    return reservation;
  } catch (error: any) {
    throw new Error(error);
  }
}
