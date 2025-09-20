import { getUsersByCompanyId } from "@/app/server/actions/getUsersByCompanyId";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    
    // Convert URL format back to company name format
    const convertedCompanyName = companyId
      ?.split('-')
      .map(word => word.toUpperCase() === 'AS' ? 'AS' : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const qs = await db.collection('companies').where('firmanavn', '==', convertedCompanyName).limit(1).get();
    const company = qs.empty ? null : ({ id: qs.docs[0].id, ...qs.docs[0].data() } as any);
    
    const response = NextResponse.json(company);
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=600');
    
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Failed getting users by company");
  }
}
