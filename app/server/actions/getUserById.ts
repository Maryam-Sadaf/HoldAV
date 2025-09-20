import getCurrentUser from "./getCurrentUser";
import { db } from "@/lib/firebaseAdmin";

interface IParams {
  userId?: string;
}

export default async function getUserById(params: IParams) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }
    const { userId } = params;

    const snap = await db.collection('users').doc(userId as string).get();
    if (!snap.exists) return null;
    const data = snap.data() as any;
    const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data?.createdAt ? new Date(data.createdAt).toISOString() : undefined);
    const updatedAt = data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data?.updatedAt ? new Date(data.updatedAt).toISOString() : undefined);
    const user = {
      id: snap.id,
      _id: data?._id ?? snap.id,
      email: data?.email ?? null,
      firstname: data?.firstname ?? null,
      lastname: data?.lastname ?? null,
      hashedPassword: data?.hashedPassword ?? null,
      accessToken: data?.accessToken ?? null,
      emailVerified: data?.emailVerified ?? null,
      role: data?.role ?? 'user',
      createdAt,
      updatedAt,
    } as any;

    if (!user) {
      return null;
    }

    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}
