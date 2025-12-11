import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
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
    const existingQs = await db.collection('users').where('email', '==', email).limit(1).get();
    const existingUser = existingQs.empty ? null : ({ id: existingQs.docs[0].id, ...existingQs.docs[0].data() } as any);

    if (existingUser) {
      return new NextResponse("User already exists, no need to invite.", { status: 400 });
    }

    const normalizedSlug = decodeURIComponent(companyName ?? "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    let companyQs = await db.collection('companies').where('firmanavn', '==', normalizedSlug).limit(1).get();

    // Fallback for legacy title-cased records
    if (companyQs.empty && normalizedSlug) {
      const legacyName = normalizedSlug
        .split("-")
        .map((word: string) => (word.toUpperCase() === "AS" ? "AS" : word.charAt(0).toUpperCase() + word.slice(1)))
        .join(" ");
      companyQs = await db.collection('companies').where('firmanavn', '==', legacyName).limit(1).get();
    }

    const companyId = companyQs.empty ? null : ({ id: companyQs.docs[0].id, ...companyQs.docs[0].data() } as any);

    if (!companyId) {
      return new NextResponse("Firma ID er påkrevd", { status: 400 });
    }

    // Check if user is already invited to this company
    const invitedQs = await db.collection('invitedUsers')
      .where('email', '==', email)
      .where('companyId', '==', companyId?.id)
      .limit(1)
      .get();
    const isTheUserInvited = invitedQs.empty ? null : invitedQs.docs[0].data();
    if (isTheUserInvited) {
      return new NextResponse("Bruker allerede invitert", { status: 409 });
    }

    // Generate unique token for new user invitation
    const uniqueToken = crypto.randomBytes(32).toString("hex");
    
    // Create invitation record for new user
    const invitationRef = db.collection('invitations').doc(uniqueToken);
    const invitation = {
      userEmail: email,
      token: uniqueToken,
      companyName,
      companyId: companyId.id,
      adminId,
      adminName,
    } as any;
    await invitationRef.set(invitation);
    const baseUrl = "https://hold-av-zeta.vercel.app/";
    
    // Validate required values for URL generation
    if (!companyName || !adminId) {
      return new NextResponse("Missing required data for invitation link", { status: 400 });
    }
    
    // Create invitation link for new user registration
    const companySlug = companyName.replace(/\s+/g, "-").toLowerCase();
    const invitationLink = `${baseUrl}/redirect/${companySlug}/${adminId}/register?token=${uniqueToken}&invite=true&email=${encodeURIComponent(email)}`;

    const subject = `${adminName} Inviterte deg til ${companyName}`;
    const htmlContent = `
    <p><a href="${invitationLink}">Klikk her</a> for å bli med!</p>
    
    <p>Vennlig Hilsen,<br/>
    holdav.no</p>
  `;

    // Send invitation email
    try {
      await sendInvitaionLinkMail(email, "Invitation", subject, htmlContent);
    } catch (emailError) {
      console.error("Failed to send invitation email:", emailError);
      // In development, don't fail the invitation if email fails
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode: Continuing despite email error. Link:", invitationLink);
      } else {
        // Clean up the invitation record if email fails in production
        await db.collection('invitations').doc(uniqueToken).delete();
        return new NextResponse("Invitation created but email sending failed", { status: 500 });
      }
    }

    return NextResponse.json({ invitation: { token: uniqueToken, ...invitation } });
  } catch (error) {
    console.error(error);
    return new NextResponse("Klarte ikke sende invitasjonen", { status: 500 });
  }
}
