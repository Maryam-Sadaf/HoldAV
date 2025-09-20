import getCurrentUser from "@/app/server/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { slugToCompanyName } from "@/utils/slugUtils";
import { cache, generateCacheKey, CACHE_KEYS } from "@/lib/cache";

/**
 * Helper function to check for reservation conflicts
 * Handles both overlapping reservations and exact same time conflicts
 */
async function checkReservationConflict(
  roomId: string, 
  startDate: string | Date, 
  endDate: string | Date
): Promise<boolean> {
  try {
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    // Validate dates
    if (newStart >= newEnd) {
      return true; // Invalid time range
    }

    // Firestore limitation: range filters on multiple fields are not allowed.
    // Query by one range (start_date) and filter end_date in-memory.
    const conflictingQs = await db.collection('reservations')
      .where('roomId', '==', roomId)
      .where('start_date', '<', newEnd)
      .limit(50)
      .get();

    // Check for conflicts in memory
    const hasConflict = conflictingQs.docs.some((doc) => {
      const data = doc.data() as any;
      const existingStart = data?.start_date?.toDate ? data.start_date.toDate() : new Date(data?.start_date);
      const existingEnd = data?.end_date?.toDate ? data.end_date.toDate() : new Date(data?.end_date);
      
      // Check for overlap: two time ranges overlap if one starts before the other ends
      // This covers both exact matches and partial overlaps
      return existingStart < newEnd && existingEnd > newStart;
    });

    return hasConflict;
  } catch (error) {
    console.error('Error checking reservation conflict:', error);
    // In case of error, err on the side of caution and prevent booking
    return true;
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.email) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await request.json();
    const {
      roomId,
      start_date,
      end_date,
      duration,
      text,
      roomName,
      companyName,
    } = body;

    if (!roomId || !start_date || !end_date || text === undefined || text === null || !roomName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Normalize company name from slug or encoded input
    const convertedCompanyName = companyName ? slugToCompanyName(companyName) : "";
    const decodedCompanyName = (() => { try { return decodeURIComponent(companyName || ""); } catch { return companyName || ""; } })();
    const decodedSpaceCompanyName = (companyName || "").includes('%20')
      ? (companyName || "").replace(/%20/g, ' ')
      : decodedCompanyName;

    // Optimized: Single query to get company ID (try multiple candidates)
    let company: any = null;
    const candidates = [convertedCompanyName, decodedCompanyName, decodedSpaceCompanyName]
      .filter((v, i, a) => !!v && a.indexOf(v) === i);
    for (const cand of candidates) {
      const q = await db.collection('companies').where('firmanavn', '==', cand).limit(1).get();
      if (!q.empty) { company = { id: q.docs[0].id, ...q.docs[0].data() } as any; break; }
    }

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Check for time conflicts before creating reservation
    const conflictExists = await checkReservationConflict(roomId, start_date, end_date);
    if (conflictExists) {
      return NextResponse.json(
        { error: "This reservation slot is already booked" },
        { status: 400 }
      );
    }

    // Convert dates for storage
    const newStart = new Date(start_date);
    const newEnd = new Date(end_date);

    // Optimized: Direct reservation creation without nested room update
    const docRef = db.collection('reservations').doc();
    const reservationData = {
      _id: docRef.id,
      roomId: roomId,
      roomName: roomName,
      companyId: company.id,
      companyName: decodedSpaceCompanyName || convertedCompanyName,
      userId: currentUser.id,
      start_date: newStart,
      duration: String(duration),
      text: text,
      end_date: newEnd,
      createdAt: new Date(),
    } as any;
    await docRef.set(reservationData);
    const reservation = { id: docRef.id, ...reservationData } as any;

    // PERFORMANCE: Invalidate relevant caches after creating reservation
    const userCacheKey = generateCacheKey(CACHE_KEYS.USER_RESERVATIONS, currentUser.id);
    const companyCacheKey = generateCacheKey(CACHE_KEYS.COMPANY_RESERVATIONS, companyName);
    const roomCacheKey = generateCacheKey(CACHE_KEYS.ROOM_RESERVATIONS, roomName);
    
    cache.delete(userCacheKey);
    cache.delete(companyCacheKey);
    cache.delete(roomCacheKey);

    // Return minimal response for faster processing
    return NextResponse.json({ 
      reservations: [reservation],
      id: reservation.id 
    });
  } catch (err) {
    console.error("Error creating reservation:", err);
    console.error("Error details:", {
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      name: err instanceof Error ? err.name : typeof err
    });
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 });
  }
}
