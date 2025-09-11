import prisma from "@/lib/prismaDB";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyName,
      adminId,
      email,
      firstname,
      lastname,
      password,
      token,
    } = body;

    if (
      !firstname ||
      !lastname ||
      !password ||
      !email ||
      !companyName ||
      !adminId
    ) {
      throw new Error("Invalid data");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse('User already exists', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Normalize slugged company names like "test-company-as" -> "Test Company AS"
    const normalizedCompanyName = companyName
      ?.split('-')
      .map((word: string) => (word.toUpperCase() === 'AS' ? 'AS' : word.charAt(0).toUpperCase() + word.slice(1)))
      .join(' ');

    const companyId = await prisma.company.findUnique({
      where: {
        firmanavn: normalizedCompanyName,
      },
    });
    if (!companyId) {
      throw new Error("companyId is required");
    }

    // If token is provided, validate the invitation
    if (token) {
      const invitation = await prisma.invitation.findUnique({
        where: { token: token },
      });
      
      if (!invitation) {
        return new NextResponse('Invalid invitation token', { status: 400 });
      }
      
      if (invitation.userEmail !== email) {
        return new NextResponse('Email does not match invitation', { status: 400 });
      }
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: email,
        firstname: firstname,
        lastname: lastname,
        hashedPassword: hashedPassword,
        accessToken: null,
      },
    });

    // Prevent duplicate invitations for the same company
    const alreadyInvited = await prisma.invitedUser.findUnique({
      where: {
        email_companyId: {
          email: email,
          companyId: companyId.id,
        },
      },
    });
    if (alreadyInvited) {
      return new NextResponse('User already invited to this company', { status: 409 });
    }

    // Create invited user record
    const insertedInvitedUser = await prisma.invitedUser.create({
      data: {
        companyId: companyId?.id,
        userId: user?.id,
        firstname: user?.firstname,
        lastname: user?.lastname,
        email: user?.email,
        adminId: adminId,
      },
    });

    // If this was from an invitation token, clean up the invitation
    if (token) {
      await prisma.invitation.delete({
        where: { token: token },
      });
    }

    return NextResponse.json(insertedInvitedUser);
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to create user', { status: 500 });
  }
}
