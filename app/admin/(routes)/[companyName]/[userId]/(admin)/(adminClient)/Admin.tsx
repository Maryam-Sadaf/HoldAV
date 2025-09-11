import React from "react";
import Container from "@/components/Container";
import AdminClient from "./AdminClient";
import { getUsersByCompanyId } from "@/app/server/actions/getUsersByCompanyId";
import { authorizedUser } from "@/app/server/actions/authorizedUsers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import EmptyState from "@/components/EmptyState";

interface IParams {
  userId?: string;
  companyName?: string;
}

const Admin = async ({ params }: { params: IParams }) => {
  const { userId, companyName } = params;
  const session: any = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const currentUser = session.user;
  let authorizedUsers: Awaited<ReturnType<typeof authorizedUser>> = [];
  let roomsOfTheCurrentCompany: any;
  let reservationByCompanyName: any;
  let usersByCompanyId: Awaited<ReturnType<typeof getUsersByCompanyId>> = [];

  // Optimized: Fetch all data in parallel instead of sequential
  const fetchAllData = async () => {
    try {
      const [roomsRes, usersRes, reservationsRes, companyRes, usersByCompanyRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_URL}/api/rooms/company/${companyName}`, { next: { revalidate: 60 } }),
        fetch(`${process.env.NEXT_PUBLIC_URL}/api/authorized-users/${companyName}`, { next: { revalidate: 60 } }),
        fetch(`${process.env.NEXT_PUBLIC_URL}/api/reservation/company/${companyName}`, { next: { revalidate: 60 } }),
        fetch(`${process.env.NEXT_PUBLIC_URL}/api/company/${companyName}`, { next: { revalidate: 60 } }),
        fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/company/${encodeURIComponent(String(companyName ?? ''))}`, { next: { revalidate: 60 } })
      ]);

      const [rooms, authorizedUsersData, reservations, company, usersByCompanyData] = await Promise.all([
        roomsRes.ok ? roomsRes.json() : [],
        usersRes.ok ? usersRes.json() : [],
        reservationsRes.ok ? reservationsRes.json() : [],
        companyRes.ok ? companyRes.json() : null,
        usersByCompanyRes.ok ? usersByCompanyRes.json() : []
      ]);

      return { rooms, authorizedUsersData, reservations, company, usersByCompanyData };
    } catch (error) {
      console.error('Error fetching admin data:', error);
      return { rooms: [], authorizedUsersData: [], reservations: [], company: null, usersByCompanyData: [] };
    }
  };


  // Use optimized parallel data fetching
  const { rooms, authorizedUsersData, reservations, company, usersByCompanyData } = await fetchAllData();
  
  roomsOfTheCurrentCompany = rooms;
  authorizedUsers = authorizedUsersData;
  reservationByCompanyName = reservations;
  usersByCompanyId = usersByCompanyData;

  // if (!currentUser || currentUser === null) {
  //   <EmptyState
  //     title="Uautorisert"
  //     subTitle="Uautorisert, kun for administrator"
  //   />;
  // }
  if (!currentUser) {
    <EmptyState
      title="Uautorisert"
      subTitle="Uautorisert, kun for administrator"
    />;
  }
  return (
    <Container>
      <AdminClient
        currentUser={currentUser}
        company={company}
        roomsOfTheCurrentCompany={roomsOfTheCurrentCompany || []}
        reservationByCompanyName={reservationByCompanyName || []}
        usersByCompanyId={usersByCompanyId || []}
        authorizedUsers={authorizedUsers || []}
        companyName={companyName}
      />
    </Container>
  );
};

export default Admin;
