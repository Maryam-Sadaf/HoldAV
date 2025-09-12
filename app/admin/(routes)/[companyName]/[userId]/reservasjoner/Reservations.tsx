import EmptyState from "@/components/EmptyState";
import React from "react";
import ReservationClient from "./ReservationClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

interface IParams {
  companyName?: string;
}

const Reservations = async ({ params }: { params: Promise<IParams> }) => {
  const { companyName } = await params || {} as IParams;
  const session: any = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const currentUser = session.user;
  if (!currentUser || currentUser === null) {
    return (
      <EmptyState
        title="Uautorisert"
        subTitle="Uautorisert, vennligst logg inn"
      />
    );
  }

  let reservations: any = [];
  const getReservationsForUser = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/reservation/user/${currentUser.id}`,
        { cache: 'no-store' }
      );
      if (!res.ok) {
        console.error('Failed to fetch reservations:', res.status, res.statusText);
        return [];
      }
      const data = await res.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
  };
  const getReservationsForCompany = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/reservation/company/${companyName}`,
        { cache: 'no-store' }
      );
      if (!res.ok) {
        console.error('Failed to fetch reservations for company:', res.status, res.statusText);
        return [];
      }
      const data = await res.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching reservations for company:', error);
      return [];
    }
  };
  
  try {
    reservations = currentUser?.role === 'admin'
      ? await getReservationsForCompany()
      : await getReservationsForUser();
  } catch (e) {
    console.error('Error in reservations page:', e);
    reservations = [];
  }

  return (
    <ReservationClient reservations={reservations} currentUser={currentUser} companyName={companyName} />
  );
};

export default Reservations;
