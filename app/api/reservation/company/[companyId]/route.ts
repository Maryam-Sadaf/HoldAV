import getReservationByCompanyName from "@/app/server/actions/getReservationByCompanyName";
import getRoomsByCompanyName from "@/app/server/actions/getRoomsByCompanyName";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { cache, generateCacheKey, CACHE_KEYS } from "@/lib/cache";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    
    // PERFORMANCE: Check cache first
    const cacheKey = generateCacheKey(CACHE_KEYS.COMPANY_RESERVATIONS, companyId);
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // If not in cache, fetch from database
    const reservationByCompany = await getReservationByCompanyName({
      companyName: companyId,
    });

    // PERFORMANCE: Cache the result for 1 minute (company data changes more frequently)
    cache.set(cacheKey, reservationByCompany, 1);

    return NextResponse.json(reservationByCompany);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed getting reservation by company" }, { status: 500 });
  }
}
