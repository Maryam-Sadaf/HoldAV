import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";
import crypto from "crypto";
import { sendInvitaionLinkMail } from "@/lib/sendMail";
import getCurrentUser from "@/app/server/actions/getCurrentUser";
import getUserById from "@/app/server/actions/getUserById";

interface IParams {
  userId?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, companyName, adminId, adminName } = body;

    if (!email || !companyName || !adminId || !adminName) {
      return new NextResponse("Ugyldig data motatt", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return new NextResponse("User already exists, no need to invite.", { status: 400 });
    }

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
      return new NextResponse("Firma ID er påkrevd", { status: 400 });
    }

    // Check if user is already invited to this company
    const isTheUserInvited = await prisma.invitedUser.findUnique({
      where: {
        email_companyId: {
          email: email,
          companyId: companyId?.id,
        },
      },
    });
    if (isTheUserInvited) {
      return new NextResponse("Bruker allerede invitert", { status: 409 });
    }

    // Generate unique token for new user invitation
    const uniqueToken = crypto.randomBytes(32).toString("hex");
    
    // Create invitation record for new user
    const invitation = await prisma.invitation.create({
      data: {
        userEmail: email,
        token: uniqueToken,
        companyName,
        companyId: companyId.id,
        adminId,
        adminName,
        // Note: userId is null for new users until they register
      },
    });
    const baseUrl = "http://localhost:3000";
    
    // Debug logging
    console.log("🔍 Invitation Link Debug:");
    console.log("  companyName:", companyName);
    console.log("  normalizedCompanyName:", normalizedCompanyName);
    console.log("  adminId:", adminId);
    console.log("  email:", email);
    
    // Validate required values for URL generation
    if (!companyName || !adminId) {
      console.error("❌ Missing required values for invitation link:");
      console.error("  companyName:", companyName);
      console.error("  adminId:", adminId);
      return new NextResponse("Missing required data for invitation link", { status: 400 });
    }
    
    // Create invitation link for new user registration
    // Use original companyName for URL (should already be in slug format)
    const companySlug = companyName.replace(/\s+/g, "-").toLowerCase();
    const invitationLink = `${baseUrl}/redirect/${companySlug}/${adminId}/register?token=${uniqueToken}&invite=true&email=${encodeURIComponent(email)}`;
    
    console.log("  Generated invitation link:", invitationLink);

    const subject = `${adminName} Inviterte deg til ${companyName}`;
    const htmlContent = `
    <p><a href="${invitationLink}">Klikk her</a> for å bli med!</p>
    
    <p>Vennlig Hilsen,<br/>
    holdav.no</p>
  `;

    // Send invitation email
    try {
      await sendInvitaionLinkMail(email, "Invitation", subject, htmlContent);
      console.log("✅ Invitation email sent successfully to:", email);
    } catch (emailError) {
      console.error("❌ Failed to send invitation email:", emailError);
      // Clean up the invitation record if email fails
      await prisma.invitation.delete({
        where: { token: uniqueToken },
      });
      return new NextResponse("Invitation created but email sending failed", { status: 500 });
    }

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error(error);
    return new NextResponse("Klarte ikke sende invitasjonen", { status: 500 });
  }
}
