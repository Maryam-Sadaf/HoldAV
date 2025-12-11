import getCurrentUser from "@/app/server/actions/getCurrentUser";
import { db } from "@/lib/firebaseAdmin";
interface IParams {
  companyName?: string;
  adminId?: string;
  requestedUserId?: string | null;
}
export async function authorizedUser(params: IParams) {
  try {
    const { companyName, requestedUserId } = params;
    
    const normalizedSlug = decodeURIComponent(companyName ?? "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    // Primary lookup by stored slug
    let companyQs = await db.collection('companies').where('firmanavn', '==', normalizedSlug).get();

    // Fallback for legacy title-cased records
    if (companyQs.empty && normalizedSlug) {
      const legacyName = normalizedSlug
        .split("-")
        .map((word) => (word.toUpperCase() === "AS" ? "AS" : word.charAt(0).toUpperCase() + word.slice(1)))
        .join(" ");
      companyQs = await db.collection('companies').where('firmanavn', '==', legacyName).get();
    }

    let company = null as any;
    if (!companyQs.empty) {
      const docs = companyQs.docs;
      if (requestedUserId) {
        const matchByUser = docs.find((d) => (d.data() as any)?.userId === requestedUserId);
        company = matchByUser
          ? ({ id: matchByUser.id, ...matchByUser.data() } as any)
          : ({ id: docs[0].id, ...docs[0].data() } as any);
      } else {
        company = ({ id: docs[0].id, ...docs[0].data() } as any);
      }
    }

    if (!company) {
      throw new Error("companyId is required");
    }
    const usersQs = await db.collection('invitedUsers').where('companyId', '==', company?.id).get();
    const invitedUsers = usersQs.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

    // Include company creator as authorized admin
    let creatorUser: any = null;
    if (company?.userId) {
      const creatorSnap = await db.collection('users').doc(company.userId).get();
      if (creatorSnap.exists) {
        const data = creatorSnap.data() as any;
        creatorUser = {
          id: creatorSnap.id,
          userId: creatorSnap.id,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          role: data.role,
          companyId: company.id,
          adminId: company.userId,
        };
      }
    }

    const merged = [
      ...(invitedUsers || []),
      ...(creatorUser ? [creatorUser] : []),
    ];

    const safeUser = merged.map((user: any) => ({
      ...user,
      createdAt: user.createdAt?.toDate ? user.createdAt.toDate().toISOString() : user.createdAt,
    }));

    return safeUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
