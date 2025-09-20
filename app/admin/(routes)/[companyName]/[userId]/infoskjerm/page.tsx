import React from "react";
import ReservationClient from "../reservasjoner/ReservationClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { cookies } from "next/headers";

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
      const base = (process.env.NEXT_PUBLIC_URL || '').replace(/\/$/, '');
      const path = currentUser?.role === 'admin'
        ? `/api/reservation/company/${encodeURIComponent(companyName)}`
        : `/api/reservation/user/${currentUser.id}`;
      const apiUrl = base ? `${base}${path}` : path;

      const cookieStore = await cookies();
      const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
      const res = await fetch(apiUrl, {
        next: { revalidate: 30 },
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      });
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
