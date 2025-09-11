import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prismaDB";

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, firstname, lastname, password, companyId, adminId, isInvited, token } = body;

    // Validate required fields
    if (!email || !firstname || !lastname || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If this is an invitation-based signup, validate the invitation
    let invitation = null;
    console.log("🔍 Invitation check:", { isInvited, token, email });
    
    if (isInvited && token) {
      console.log("🔍 Processing invitation-based signup for:", email);
      
      console.log("🔍 Looking up invitation with token:", token);
      
      invitation = await prisma.invitation.findUnique({
        where: { token }
      });

      console.log("🔍 Invitation lookup result:", invitation);

      if (!invitation) {
        console.log("❌ Invitation not found for token:", token);
        return NextResponse.json(
          { error: "Invalid invitation token" },
          { status: 400 }
        );
      }

      if (invitation.userEmail !== email) {
        console.log("❌ Email mismatch:", { invitationEmail: invitation.userEmail, providedEmail: email });
        return NextResponse.json(
          { error: "Email does not match invitation" },
          { status: 400 }
        );
      }

      console.log("✅ Valid invitation found:", {
        companyId: invitation.companyId,
        companyName: invitation.companyName,
        adminId: invitation.adminId,
        fullInvitation: invitation
      });
      
      // Check if companyId is missing
      if (!invitation.companyId) {
        console.log("❌ CRITICAL: Invitation found but companyId is null/undefined!");
        console.log("❌ Invitation object:", JSON.stringify(invitation, null, 2));
        return NextResponse.json(
          { error: "Invitation is missing company information" },
          { status: 400 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user with or without company association
    const userData = {
      email,
      firstname,
      lastname,
      hashedPassword,
      accessToken: null,
    };

    // If this is an invitation-based signup, add company association
    console.log("🔍 Company association check:", {
      hasInvitation: !!invitation,
      invitationCompanyId: invitation?.companyId,
      willAssociate: !!(invitation && invitation.companyId)
    });
    
    if (invitation && invitation.companyId) {
      console.log("🏢 Will associate user with company:", invitation.companyId);
    } else {
      console.log("❌ NOT associating user with company - invitation or companyId missing");
    }

    console.log("📝 Final user data before creation:", {
      email: userData.email,
      isInvited: isInvited,
      hasToken: !!token,
      invitationCompanyId: invitation?.companyId
    });

    const user = await prisma.user.create({
      data: userData,
    });

    // If this was an invitation-based signup, create invitedUser record and mark invitation as used
    if (invitation) {
      try {
        // Create invitedUser record
        await prisma.invitedUser.create({
          data: {
            companyId: invitation.companyId,
            userId: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            adminId: invitation.adminId,
          },
        });

        // Mark invitation as used by deleting it
        await prisma.invitation.delete({
          where: { token },
        });

        console.log("✅ User successfully associated with company and invitation marked as used");
      } catch (error) {
        console.error("❌ Error creating invitedUser record:", error);
        // Don't fail the registration if this fails, just log it
      }
    }

    // Don't return the hashed password
    const { hashedPassword: _, ...userWithoutPassword } = user;

    // Return user with company info if applicable
    const response = {
      user: userWithoutPassword,
      ...(invitation && {
        company: {
          id: invitation.companyId,
          name: invitation.companyName
        }
      })
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle specific Prisma/MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes("Error code 13") || error.message.includes("Unauthorized") || error.message.includes("auth required")) {
        return NextResponse.json(
          { 
            error: "Database authentication failed. Please check your MongoDB Atlas credentials and permissions.",
            details: "The database user may not have proper read/write permissions or the credentials are incorrect."
          },
          { status: 500 }
        );
      }
      
      if (error.message.includes("command insert not found")) {
        return NextResponse.json(
          { error: "Database connection issue. Please check MongoDB Atlas configuration." },
          { status: 500 }
        );
      }
      
      if (error.message.includes("duplicate key")) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }

      if (error.message.includes("network") || error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Network connection to database failed. Check your internet connection and MongoDB Atlas network settings." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

}
