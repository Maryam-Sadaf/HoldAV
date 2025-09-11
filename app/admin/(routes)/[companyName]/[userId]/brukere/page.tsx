import React, { Suspense } from "react";
import BrukerPage from "./BrukerePage";
import RoomsFallback from "../(admin)/rooms/RoomsFallback";

interface IParams {
  companyName: string;
  userId: string;
}

const Bruker = async ({ params }: { params: Promise<IParams> }) => {
  const { companyName, userId } = await params;
  
  return (
    <Suspense fallback={<RoomsFallback />}>
      <BrukerPage params={{ companyName, userId }} />
    </Suspense>
  );
};

export default Bruker;
