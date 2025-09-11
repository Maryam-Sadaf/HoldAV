import getReservationByCompanyName from "@/app/server/actions/getReservationByCompanyName";
import getReservationByUserId from "@/app/server/actions/getReservationsByUserId";
import getRoomsByCompanyName from "@/app/server/actions/getRoomsByCompanyName";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { cache, generateCacheKey, CACHE_KEYS } from "@/lib/cache";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    // PERFORMANCE: Check cache first
    const cacheKey = generateCacheKey(CACHE_KEYS.USER_RESERVATIONS, userId);
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // If not in cache, fetch from database
    const reservationByUser = await getReservationByUserId({
      userId: userId,
    });

    // PERFORMANCE: Cache the result for 2 minutes
    cache.set(cacheKey, reservationByUser, 2);

    return NextResponse.json(reservationByUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed getting reservation by user" }, { status: 500 });
  }
}
