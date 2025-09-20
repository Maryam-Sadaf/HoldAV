import { getServerSession } from "next-auth/next";
import { unstable_cache } from "next/cache";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/lib/firebaseAdmin";

export async function getSession() {
  if (typeof window === "undefined") {
    return await getServerSession(authOptions);
  }

  return null;
}

// Cache user data to avoid repeated DB queries
const getCachedUser = unstable_cache(
  async (email: string) => {
    const qs = await db.collection('users').where('email', '==', email).limit(1).get();
    if (qs.empty) return null;
    const doc = qs.docs[0];
    const data = doc.data() as any;
    const createdAt = data.createdAt instanceof Date ? data.createdAt : (data.createdAt?.toDate ? data.createdAt.toDate() : undefined);
    const updatedAt = data.updatedAt instanceof Date ? data.updatedAt : (data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined);
    return {
      id: doc.id,
      email: data.email ?? null,
      firstname: data.firstname ?? null,
      lastname: data.lastname ?? null,
      role: data.role ?? 'user',
      createdAt: createdAt ? createdAt.toISOString() : undefined,
      updatedAt: updatedAt ? updatedAt.toISOString() : undefined,
      emailVerified: data.emailVerified ?? null,
    } as any;
  },
  ['current-user'],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ['user']
  }
);

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    // Use cached user lookup
    return await getCachedUser(session.user.email as string);
  } catch (error: any) {
    return null;
  }
}
