import Container from "@/components/Container";
import Heading from "@/components/Heading";
import React from "react";
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

interface IParams {
  userId?: string;
  companyName?: string;
}

const Rooms = async ({ params }: { params: Promise<IParams> }) => {
  const { userId, companyName } = await params;
  const session: any = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const currentUser = session.user;

  let authorizedUsers: Awaited<ReturnType<typeof authorizedUser>> = [];
  let roomsOfTheCurrentCompany: any;

  const getRoomsForC = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/rooms/company/${companyName}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Klarte ikke hente møterom.");
    }
    return res.json();
  };
  const getAuthorizedUsers = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/authorized-users/${companyName}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Innhenting av data feilet");
    }
    return res.json();
  };
  const getCompany = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/company/${companyName}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Innhenting av data feilet");
    }
    return res.json();
  };
  let company: any;
  try {
    roomsOfTheCurrentCompany = await getRoomsForC();
    company = await getCompany();
    authorizedUsers = await getAuthorizedUsers();
  } catch (e) {
    console.log(e);
  }
  if (!currentUser) {
    return (
      <EmptyState
        title="Uautorisert"
        subTitle="Uautorisert, kun for administrator"
      />
    );
  }

  return (
    <Container>
      <div className="relative w-full">
        <RoomsClient
          currentUser={currentUser}
          company={company}
          roomsOfTheCurrentCompany={roomsOfTheCurrentCompany}
          authorizedUsers={authorizedUsers}
          companyName={companyName}
        />
      </div>
    </Container>
  );
};

export default Rooms;
