import getCurrentUser from "@/app/server/actions/getCurrentUser";
import { db } from "@/lib/firebaseAdmin";

export async function getAllUsers() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }

    const qs = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = qs.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

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
