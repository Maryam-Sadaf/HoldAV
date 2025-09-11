import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    // Validate required parameters
    if (!token || !email) {
      return NextResponse.json(
        { valid: false, reason: "Token and email are required" },
        { status: 400 }
      );
    }

    console.log("🔍 Validating invitation:", { token: token.substring(0, 8) + "...", email });

    // Look up the invitation in the database
    const invitation = await prisma.invitation.findUnique({
      where: {
        token: token,
      }
    });

    // Check if invitation exists
    if (!invitation) {
      console.log("❌ Invitation not found for token");
      return NextResponse.json(
        { valid: false, reason: "Invalid or expired token" },
        { status: 404 }
      );
    }

    // Check if email matches
    if (invitation.userEmail !== email) {
      console.log("❌ Email mismatch:", { 
        invitationEmail: invitation.userEmail, 
        providedEmail: email 
      });
      return NextResponse.json(
        { valid: false, reason: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check if invitation is already used (optional - depends on your business logic)
    // You might want to add a 'used' field to your invitation table
    // For now, we'll just check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      console.log("❌ User already exists for this email");
      return NextResponse.json(
        { valid: false, reason: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Check if invitation is expired (optional - add expiration logic if needed)
    // For now, we'll assume invitations don't expire unless you add an expiration field

    console.log("✅ Invitation is valid:", {
      companyId: invitation.companyId,
      companyName: invitation.companyName,
      email: invitation.userEmail
    });

    // Return valid invitation data
    return NextResponse.json({
      valid: true,
      companyId: invitation.companyId,
      email: invitation.userEmail,
      companyName: invitation.companyName,
      adminId: invitation.adminId,
      adminName: invitation.adminName
    });

  } catch (error) {
    console.error("❌ Error validating invitation:", error);
    return NextResponse.json(
      { valid: false, reason: "Internal server error" },
      { status: 500 }
    );
  }
}
