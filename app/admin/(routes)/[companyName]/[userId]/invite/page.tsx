import React, { Suspense } from "react";
import InvitePage from "./InvitePage";
import RoomsFallback from "../(admin)/rooms/RoomsFallback";

interface IParams {
  userId?: string;
  companyName?: string;
}

const Invite = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={<RoomsFallback />}>
      <InvitePage params={resolvedParams as any} />
    </Suspense>
  );
};

export default Invite;
