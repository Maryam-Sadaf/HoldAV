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
    
    // Performance: Enhanced caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600, max-age=60');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=300');
    response.headers.set('Vary', 'Accept-Encoding');
    response.headers.set('ETag', `"${JSON.stringify(roomsForCompany).length}-${Date.now()}"`);
    
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Failed getting authorized users");
  }
}
