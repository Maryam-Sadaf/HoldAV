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
    // Convert URL slug back to company name format (e.g., "test-company-as" -> "Test Company AS")
    const convertedCompanyName = companyId
      ?.split('-')
      .map(word => word.toUpperCase() === 'AS' ? 'AS' : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const roomsForCompany = await getRoomsByCompanyName({
      companyName: convertedCompanyName,
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
