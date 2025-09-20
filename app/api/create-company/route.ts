import getCurrentUser from "@/app/server/actions/getCurrentUser";
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return;
    }

    const body = await request.json();
    const {
      organisasjonsnummer,
      firmanavn,
      adresse,
      postnummer,
      poststed,
      fornavn,
      etternavn,
      epost,
    } = body;

    const companyRef = db.collection('companies').doc();
    const companyDetails = {
      id: companyRef.id,
      organisasjonsnummer,
      firmanavn: firmanavn?.replace(/\s+/g, "-").toLowerCase(),
      adresse,
      postnummer,
      poststed,
      fornavn,
      etternavn,
      epost,
      userId: currentUser?.id,
    } as any;
    await companyRef.set({ ...companyDetails });
    await db.collection('users').doc(currentUser?.id as string).update({ role: "admin", updatedAt: new Date() });
    return NextResponse.json(companyDetails);
  } catch (error) {
    console.error("Error in POST endpoint:", error);
    return NextResponse.error();
  }
}
