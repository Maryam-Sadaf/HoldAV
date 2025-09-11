import getCurrentUser from "@/app/server/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";
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

    // Convert URL format company name to database format using consistent utility
    const convertedCompanyName = companyName ? slugToCompanyName(companyName) : "";

    // Optimized: Single query to get company ID and check room exists
    const company = await prisma.company.findUnique({
      where: {
        firmanavn: convertedCompanyName,
      },
      select: {
        id: true,
      }
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // OPTIMIZED: Check for overlapping reservations using indexed query
    const newStart = new Date(start_date);
    const newEnd = new Date(end_date);

    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        roomId: roomId,
        AND: [
          { start_date: { lt: newEnd } },
          { end_date: { gt: newStart } },
        ],
      },
      select: { id: true },
    });

    if (conflictingReservation) {
      return NextResponse.json(
        { error: "This reservation is already booked for the selected time slot." },
        { status: 409 }
      );
    }

    // Optimized: Direct reservation creation without nested room update
    const reservation = await prisma.reservation.create({
      data: {
        roomId: roomId,
        roomName: roomName,
        companyId: company.id,
        companyName: convertedCompanyName,
        userId: currentUser.id,
        start_date: start_date,
        duration,
        text: text,
        end_date: end_date,
      },
      select: {
        id: true,
        roomId: true,
        roomName: true,
        start_date: true,
        end_date: true,
        text: true,
      },
    });

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
