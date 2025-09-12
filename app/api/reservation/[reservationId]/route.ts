// pages/api/rooms/[roomId]/reservations.ts
import getCurrentUser from "@/app/server/actions/getCurrentUser";
import prisma from "@/lib/prismaDB";
import { sendUpdateMail } from "@/lib/sendMail";
import { NextResponse } from "next/server";
import { cache, generateCacheKey, CACHE_KEYS } from "@/lib/cache";

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
  const existing = await prisma.reservation.findFirst({
    where: { id: reservationId },
    select: { id: true, userId: true, companyName: true, roomId: true }
  });

  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [
        { userId: currentUser?.id },
        {
          room: {
            userId: currentUser?.id,
          },
        },
      ],
    },
  });

  // Invalidate API caches so subsequent GETs return fresh data immediately
  try {
    if (existing?.userId) {
      const userKey = generateCacheKey(CACHE_KEYS.USER_RESERVATIONS, existing.userId);
      cache.delete(userKey);
    }
    if (existing?.companyName) {
      const companyKey = generateCacheKey(CACHE_KEYS.COMPANY_RESERVATIONS, existing.companyName);
      cache.delete(companyKey);
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
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        OR: [
          { userId: currentUser?.id },
          {
            room: {
              userId: currentUser?.id,
            },
          },
        ],
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Reservation not found or access denied" }, 
        { status: 404 }
      );
    }

    // Fast update without complex OR condition
    const reservation = await prisma.reservation.update({
      data: {
        start_date: start_date,
        end_date: end_date,
        text: text,
      },
      where: {
        id: reservationId,
      },
      select: {
        id: true,
        start_date: true,
        end_date: true,
        text: true,
      },
    });

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
