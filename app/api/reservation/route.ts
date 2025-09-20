import getCurrentUser from "@/app/server/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { slugToCompanyName } from "@/utils/slugUtils";
import { cache, generateCacheKey, CACHE_KEYS } from "@/lib/cache";

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

    // OPTIMIZED: Check for overlapping reservations using indexed query
    const newStart = new Date(start_date);
    const newEnd = new Date(end_date);

    // Firestore limitation: range filters on multiple fields are not allowed.
    // Query by one range (start_date) and filter end_date in-memory.
    const conflictingQs = await db.collection('reservations')
      .where('roomId', '==', roomId)
      .where('start_date', '<', newEnd)
      .limit(50)
      .get();
    const conflictingReservation = conflictingQs.docs.find((d) => {
      const data = d.data() as any;
      const existingEnd = data?.end_date?.toDate ? data.end_date.toDate() : new Date(data?.end_date);
      return existingEnd > newStart;
    });

    if (conflictingReservation) {
      return NextResponse.json(
        { error: "Dette tidsrommet er allerede reservert." },
        { status: 409 }
      );
    }

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
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 });
  }
}
