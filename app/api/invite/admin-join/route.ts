import { db } from "@/lib/firebaseAdmin";
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
    const existingQs = await db.collection('users').where('email', '==', email).limit(1).get();
    const existingUser = existingQs.empty ? null : ({ id: existingQs.docs[0].id, ...existingQs.docs[0].data() } as any);
    if (existingUser) {
      return new NextResponse('User already exists', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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
      throw new Error("companyId is required");
    }

    // If token is provided, validate the invitation
    if (token) {
      const invitationSnap = await db.collection('invitations').doc(token).get();
      const invitation = invitationSnap.exists ? ({ id: invitationSnap.id, ...invitationSnap.data() } as any) : null;
      
      if (!invitation) {
        return new NextResponse('Invalid invitation token', { status: 400 });
      }
      
      if (invitation.userEmail !== email) {
        return new NextResponse('Email does not match invitation', { status: 400 });
      }
    }

    // Create new user
    const userRef = db.collection('users').doc();
    const now = new Date();
    const user = { id: userRef.id, _id: userRef.id, email, firstname, lastname, hashedPassword, accessToken: null, role: 'user', emailVerified: true, createdAt: now, updatedAt: now } as any;
    await userRef.set({ _id: userRef.id, email, firstname, lastname, hashedPassword, accessToken: null, role: 'user', emailVerified: true, createdAt: now, updatedAt: now });

    // Prevent duplicate invitations for the same company
    const invitedQs = await db.collection('invitedUsers').where('email', '==', email).where('companyId', '==', companyId.id).limit(1).get();
    const alreadyInvited = invitedQs.empty ? null : invitedQs.docs[0].data();
    if (alreadyInvited) {
      return new NextResponse('User already invited to this company', { status: 409 });
    }

    // Create invited user record
    const invitedDoc = await db.collection('invitedUsers').add({
      companyId: companyId?.id,
      userId: user?.id,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      adminId: adminId,
    });
    const insertedInvitedUser = { id: invitedDoc.id, companyId: companyId?.id, userId: user?.id, firstname: user?.firstname, lastname: user?.lastname, email: user?.email, adminId } as any;

    // If this was from an invitation token, clean up the invitation
    if (token) {
      await db.collection('invitations').doc(token).delete();
    }

    return NextResponse.json(insertedInvitedUser);
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to create user', { status: 500 });
  }
}
