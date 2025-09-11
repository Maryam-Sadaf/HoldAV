import prisma from "@/lib/prismaDB";
import { NextResponse } from "next/server";
export async function POST(request: Request): Promise<void | Response> {
  try {
    const body = await request.json();
    const { token, companyName, userId, adminId } = body;
    if (!token || !companyName || !userId || !adminId) {
      throw new Error("Ugyldig data");
    }

    const invitedToken = await prisma.invitation.findUnique({
      where: {
        token: token,
      },
    });
    if (!invitedToken) {
      return new NextResponse("Ugyldig token", { status: 400 });
    }

    // check wash company exists bash n storiwah f inviteUser u bash njbdo company name
    const companyId = await prisma.company.findUnique({
      where: {
        firmanavn: companyName,
      },
    });
    if (!companyId) {
      throw new Error("FirmaID er påkrevd");
    }
    if (!token) {
      throw new Error("token er påkrevd");
    }

    // check if the user exists based on params
    const userByToken = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userByToken) {
      throw new Error("Ugyldig data");
    }

    const insertedInvitedUser = await prisma.invitedUser.create({
      data: {
        companyId: companyId?.id,
        userId: userByToken?.id,
        firstname: userByToken?.firstname,
        lastname: userByToken?.lastname,
        email: userByToken?.email,
        adminId: adminId,
      },
    });
    await prisma.invitation.delete({
      where: {
        token: token,
      },
    });
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        accessToken: null,
      },
    });

    return NextResponse.json(insertedInvitedUser);

    // // Insert the user data into the InvitedUsers table
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
