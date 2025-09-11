import prisma from "@/lib/prismaDB";

const getUserAccessToken = async (userEmail: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

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
