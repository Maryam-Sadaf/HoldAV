import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import React, { Suspense } from "react";
import RoomClient from "./RoomClient";
import getCurrentUser from "@/app/server/actions/getCurrentUser";
import EmptyState from "@/components/EmptyState";
import getReservationsByRoomId from "@/app/server/actions/getReservationsByRoomId";
import Heading from "@/components/Heading";
import getRoomByName from "@/app/server/actions/getByRoomName";
import getReservationsByRoomName from "@/app/server/actions/getReservationByRoomName";
import { authorizedUser } from "@/app/server/actions/authorizedUsers";
import { getUsersByCompanyId } from "@/app/server/actions/getUsersByCompanyId";
import { getCreatorByCompanyName } from "@/app/server/actions/getCreatorOfTheCompany";
import RoomPageSkeleton from "@/components/loading/RoomPageSkeleton";
import { formatRoomNameForDisplay } from "@/utils/slugUtils";

// Enable dynamic rendering for real-time reservation updates
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable ISR caching for real-time data

interface IParams {
  roomId?: string;
  roomName?: string;
  companyName?: string;
}
const Rooms = async ({ params }: { params: Promise<IParams> }) => {
  const { roomName, companyName } = await params;
  console.log('🌍 SERVER PAGE: Received params', { roomName, companyName });

  // Parallel data fetching for better performance
  const [
    currentUser,
    roomByName,
    authorizedUsers,
    reservationsByRomName,
    creatorByCompanyName
  ] = await Promise.all([
    getCurrentUser(),
    getRoomByName({ roomName: roomName }),
    authorizedUser({ companyName: companyName }),
    getReservationsByRoomName({ roomName: roomName }),
    getCreatorByCompanyName({ companyName: companyName })
  ]);
  console.log('🌍 SERVER PAGE: Fetched data', {
    roomNameParam: roomName,
    fetchedRoomId: roomByName?.id,
    fetchedRoomName: roomByName?.name
  });

  // Note: roomId query requires Firestore index - skipping for now
  // roomName query is working and returning reservations

  // Use reservations from roomName query (already working)
  const uniqueReservations = Array.isArray(reservationsByRomName) ? reservationsByRomName : [];

  if (!currentUser) {
    return (
      <EmptyState
        title="Uautorisert"
        subTitle="Uautorisert, vennligst logg inn"
      />
    );
  }
  return (
    <Container>
      <div className="py-3 pb-3">
        <Heading
          title={formatRoomNameForDisplay(roomByName?.name) || "Møterom eksisterer ikke"}
          flex
          subTitle={companyName || ""}
        />
      </div>

      <Suspense fallback={<RoomPageSkeleton />}>
        <div className="relative w-full ">
          <RoomClient
            key={`room-${roomByName?.id || roomName}-${companyName}-${Math.random()}`}
            currentUser={currentUser}
            roomByName={roomByName}
            reservationsByRomName={uniqueReservations}
            authorizedUsers={authorizedUsers}
          />
        </div>
      </Suspense>
    </Container>
  );
};

export default Rooms;
