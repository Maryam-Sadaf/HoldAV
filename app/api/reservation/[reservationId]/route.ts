// pages/api/rooms/[roomId]/reservations.ts
import getCurrentUser from "@/app/server/actions/getCurrentUser";
import { db } from "@/lib/firebaseAdmin";
import { sendUpdateMail } from "@/lib/sendMail";
import { NextResponse } from "next/server";
import { cache, generateCacheKey, CACHE_KEYS } from "@/lib/cache";
import { companyNameToSlug } from "@/utils/slugUtils";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Vennligst Logg inn");
  }

  const { reservationId } = await params;
  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Ugyldig ID");
  }

  // Fetch reservation owner and company before deleting (needed to invalidate caches)
  const existingSnap = await db.collection('reservations').doc(reservationId).get();
  const existing = existingSnap.exists ? ({ id: existingSnap.id, ...existingSnap.data() } as any) : null;

  if (!existing) {
    return NextResponse.json({ error: "Ugyldig ID" }, { status: 404 });
  }
  // Preserve original authorization: owner OR room owner
  let isRoomOwner = false;
  if (existing.roomId) {
    const roomSnap = await db.collection('rooms').doc(String(existing.roomId)).get();
    const roomData = roomSnap.exists ? roomSnap.data() as any : null;
    isRoomOwner = !!roomData && roomData.userId === currentUser?.id;
  }
  if (existing.userId !== currentUser?.id && !isRoomOwner) {
    return NextResponse.json({ error: "Ugyldig ID" }, { status: 403 });
  }
  await db.collection('reservations').doc(reservationId).delete();
  const reservation = { count: 1 } as any;

  // Invalidate API caches so subsequent GETs return fresh data immediately
  try {
    if (existing?.userId) {
      const userKey = generateCacheKey(CACHE_KEYS.USER_RESERVATIONS, existing.userId);
      cache.delete(userKey);
    }
    if (existing?.companyName) {
      // Invalidate by both DB format and slug format (GET uses slug param)
      const companyKeyDb = generateCacheKey(CACHE_KEYS.COMPANY_RESERVATIONS, existing.companyName);
      const companyKeySlug = generateCacheKey(CACHE_KEYS.COMPANY_RESERVATIONS, companyNameToSlug(existing.companyName));
      cache.delete(companyKeyDb);
      cache.delete(companyKeySlug);
    }
    if (existing?.roomId) {
      const roomKey = generateCacheKey(CACHE_KEYS.ROOM_RESERVATIONS, String(existing.roomId));
      cache.delete(roomKey);
    }
  } catch (e) {
    // Avoid throwing on cache issues
    console.error('Cache invalidation error (reservation delete):', e);
  }
  return NextResponse.json(reservation);
}

export async function PUT(request: Request, { params }: { params: Promise<IParams> }) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    
    if (!currentUser || !currentUser.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { start_date, end_date, text } = body;

    if (!start_date || !end_date || text === undefined || text === null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const { reservationId } = await params;
    
    if (!reservationId || typeof reservationId !== "string") {
      return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
    }
    
    // CRITICAL: Check ownership before allowing update
    const existingReservationSnap = await db.collection('reservations').doc(reservationId).get();
    const existingReservation = existingReservationSnap.exists ? ({ id: existingReservationSnap.id, ...existingReservationSnap.data() } as any) : null;

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Reservation not found" }, 
        { status: 404 }
      );
    }

    // SECURITY: Enforce ownership - users can only update their own reservations
    if (existingReservation.userId !== currentUser.id) {
      return NextResponse.json(
        { error: "Unauthorized: You can only update your own reservations" }, 
        { status: 403 }
      );
    }

    // Check for time conflicts with other reservations (excluding this one)
    const newStart = new Date(start_date);
    const newEnd = new Date(end_date);

    // Validate dates
    if (newStart >= newEnd) {
      return NextResponse.json(
        { error: "Invalid time range: start date must be before end date" },
        { status: 400 }
      );
    }

    // Check for conflicts with other reservations in the same room
    const conflictingQs = await db.collection('reservations')
      .where('roomId', '==', existingReservation.roomId)
      .where('start_date', '<', newEnd)
      .limit(50)
      .get();

    // Check for conflicts in memory (excluding the current reservation being updated)
    const hasConflict = conflictingQs.docs.some((doc) => {
      // Skip the reservation we're updating
      if (doc.id === reservationId) return false;
      
      const data = doc.data() as any;
      const existingStart = data?.start_date?.toDate ? data.start_date.toDate() : new Date(data?.start_date);
      const existingEnd = data?.end_date?.toDate ? data.end_date.toDate() : new Date(data?.end_date);
      
      // Check for overlap: two time ranges overlap if one starts before the other ends
      return existingStart < newEnd && existingEnd > newStart;
    });

    if (hasConflict) {
      return NextResponse.json(
        { error: "This reservation slot is already booked" },
        { status: 400 }
      );
    }

    // Update reservation
    await db.collection('reservations').doc(reservationId).update({
      start_date: newStart,
      end_date: newEnd,
      text: text,
    });
    const reservation = { id: reservationId, start_date: newStart, end_date: newEnd, text } as any;

    // Invalidate caches
    try {
      const { generateCacheKey, CACHE_KEYS } = await import("@/lib/cache");
      const cache = (await import("@/lib/cache")).cache;
      
      if (existingReservation?.userId) {
        const userKey = generateCacheKey(CACHE_KEYS.USER_RESERVATIONS, existingReservation.userId);
        cache.delete(userKey);
      }
      if (existingReservation?.companyName) {
        const companyKey = generateCacheKey(CACHE_KEYS.COMPANY_RESERVATIONS, existingReservation.companyName);
        cache.delete(companyKey);
      }
      if (existingReservation?.roomId) {
        const roomKey = generateCacheKey(CACHE_KEYS.ROOM_RESERVATIONS, String(existingReservation.roomId));
        cache.delete(roomKey);
      }
    } catch (e) {
      console.error('Cache invalidation error (reservation update):', e);
    }

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: "Reservation updated successfully",
      data: reservation
    });
  } catch (err) {
    console.log("Reservation update error:", err);
    return NextResponse.json(
      { error: "Failed to update reservation" }, 
      { status: 500 }
    );
  }
}
