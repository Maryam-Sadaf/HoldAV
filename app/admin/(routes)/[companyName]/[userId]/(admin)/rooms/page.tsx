import Container from "@/components/Container";
import Heading from "@/components/Heading";
import React, { Suspense } from "react";
import { getRooms } from "@/app/server/actions/getRooms";
import RoomsClient from "./RoomsClient";
import EmptyState from "@/components/EmptyState";
import getRoomsByUserId from "@/app/server/actions/getRoomsByUserId";
import getUserById from "@/app/server/actions/getUserById";
import { authorizedUser } from "@/app/server/actions/authorizedUsers";
import getRoomsByCompanyName from "@/app/server/actions/getRoomsByCompanyName";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import Rooms from "./Rooms";
import RoomsFallback from "./RoomsFallback";

interface IParams {
  userId?: string;
  companyName?: string;
}
const RoomsPage = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={<RoomsFallback />}>
      <Rooms params={resolvedParams as any} />
    </Suspense>
  );
};

export default RoomsPage;
