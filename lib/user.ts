import { db } from "@/lib/firebaseAdmin";

const getUserAccessToken = async (userEmail: any) => {
  try {
    const qs = await db.collection('users').where('email', '==', userEmail).limit(1).get();
    const user = qs.empty ? null : ({ id: qs.docs[0].id, ...qs.docs[0].data() } as any);

    if (user && user.accessToken) {
      return user.accessToken;
    } else {
      throw new Error("User not found or access token not available");
    }
  } catch (error: any) {
    console.error("Error fetching user access token:", error.message);
    throw error;
  }
};

export default getUserAccessToken;
