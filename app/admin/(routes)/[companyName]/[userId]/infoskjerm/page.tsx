import React from "react";
import ReservationClient from "../reservasjoner/ReservationClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

interface IParams {
  companyName: string;
  userId: string;
}

const Infoskjerm = async ({ params }: { params: Promise<IParams> }) => {
  const { companyName, userId } = await params;

  const session: any = await getServerSession(authOptions);
  const currentUser = session?.user || null;

  // Convert URL format company name to database format for API calls
  const convertedCompanyName = companyName
    ?.split('-')
    .map(word => word.toUpperCase() === 'AS' ? 'AS' : word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Fetch all reservations - let client-side filtering handle today's filtering
  let reservations: any[] = [];
  try {
    if (currentUser?.id) {
      let apiUrl = '';
      if (currentUser?.role === 'admin') {
        // For admin users, fetch company reservations
        apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/reservation/company/${companyName}`;
      } else {
        // For regular users, fetch user reservations
        apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/reservation/user/${currentUser.id}`;
      }

      const res = await fetch(apiUrl, { next: { revalidate: 30 } }); // Reduced cache time for more frequent updates
      if (res.ok) {
        reservations = await res.json() || [];
      }
    }
  } catch (_) {}

  return (
    <ReservationClient reservations={reservations} currentUser={currentUser} companyName={convertedCompanyName} disableRefetch={false} isInfoScreen={true} />
  );
};

export default Infoskjerm;
