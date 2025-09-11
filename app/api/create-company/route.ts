import getCurrentUser from "@/app/server/actions/getCurrentUser";
import prisma from "@/lib/prismaDB";
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

    const companyDetails = await prisma.company.create({
      data: {
        organisasjonsnummer,
        firmanavn: firmanavn?.replace(/\s+/g, "-").toLowerCase(),
        adresse,
        postnummer,
        poststed,
        fornavn,
        etternavn,
        epost,
        userId: currentUser?.id,
      },
    });
    await prisma.user.update({
      where: { id: currentUser?.id },
      data: { role: "admin" },
    });
    return NextResponse.json(companyDetails);
  } catch (error) {
    console.error("Error in POST endpoint:", error);
    return NextResponse.error();
  }
}
