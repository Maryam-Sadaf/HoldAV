import getCurrentUser from "@/app/server/actions/getCurrentUser";
import prisma from "@/lib/prismaDB";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { slugToCompanyName, formatRoomNameForStorage } from "@/utils/slugUtils";

export async function POST(request: Request) {
  try {
    // Get session directly from the request
    const session: any = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, companyName } = body;
    
    if (!companyName) {
      return NextResponse.json({ error: "companyName is required" }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Convert URL format back to company name format using consistent utility
    const convertedCompanyName = companyName ? slugToCompanyName(companyName) : "";

    // Format room name with proper title case before saving to database
    const formattedRoomName = formatRoomNameForStorage(name.trim());

    // First, find the company to get its ID
    const company = await prisma.company.findUnique({
      where: {
        firmanavn: convertedCompanyName,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Create the room with both companyId and companyName
    const createRoom = await prisma.room.create({
      data: {
        name: formattedRoomName,
        userId: currentUser?.id,
        companyId: company.id,
        companyName: convertedCompanyName,
      },
    });

    return NextResponse.json(createRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
