import getRoomsByCompanyName from "@/app/server/actions/getRoomsByCompanyName";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface IParams {
  userId?: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId");
    const normalizedSlug = decodeURIComponent(companyId ?? "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    const roomsForCompany = await getRoomsByCompanyName({
      companyName: normalizedSlug,
      requestedUserId: requestedUserId || undefined,
    });
    
    const response = NextResponse.json(roomsForCompany);
    
    // Allow revalidation to ensure fresh data after room creation/deletion
    response.headers.set('Cache-Control', 'private, no-cache, must-revalidate');
    response.headers.set('Vary', 'Accept-Encoding');
    
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Failed getting authorized users");
  }
}
