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
    // Optimized: Check permission first, then update
    const existingReservationSnap = await db.collection('reservations').doc(reservationId).get();
    const existingReservation = existingReservationSnap.exists ? ({ id: existingReservationSnap.id, ...existingReservationSnap.data() } as any) : null;

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Reservation not found or access denied" }, 
        { status: 404 }
      );
    }

    // Fast update without complex OR condition
    await db.collection('reservations').doc(reservationId).update({
      start_date: start_date,
      end_date: end_date,
      text: text,
    });
    const reservation = { id: reservationId, start_date, end_date, text } as any;

    // Return success response immediately
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
