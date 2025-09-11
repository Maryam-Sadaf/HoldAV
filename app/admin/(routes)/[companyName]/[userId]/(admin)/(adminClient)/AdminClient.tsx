"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Heading from "@/components/Heading";
import Width from "@/components/Width";
import Updates from "@/components/Updates";
//import { SafeReservations, SafeRoom, safeUser } from "@/types";
import RoomsClient from "../rooms/RoomsClient";
import EmptyState from "@/components/EmptyState";
import { useParams } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface AdminClientProps {
  currentUser: any | null;
  usersByCompanyId: any;
  authorizedUsers?: any;
  roomsOfTheCurrentCompany?: any[] | null;
  companyName?: string | null;
  reservationByCompanyName?: any[] | null;
  company: any;
}

const AdminClient = ({
  authorizedUsers: authorizedUsersInit,
  roomsOfTheCurrentCompany: roomsOfTheCurrentCompanyInit,
  currentUser,
  company: companyInit,
  reservationByCompanyName: reservationByCompanyNameInit,
  usersByCompanyId,
  companyName,
}: AdminClientProps) => {
  const [isAuthorized, setIsAuthorized] = useState(true);
  const params = useParams<{ userId: string; item: string }>();
  const userId = params ? params.userId : null;

  const { data: authorizedUsers } = useQuery({
    queryKey: ["authorizedUsers"],
    queryFn: async () => {
      const res = await axios.get(`/api/authorized-users/${companyName}`);
      return res.data;
    },
    initialData: authorizedUsersInit,
    refetchOnMount: true,
  });

  const { data: roomsOfTheCurrentCompany } = useQuery({
    queryKey: ["roomsForCompany"],
    queryFn: async () => {
      const res = await axios.get(`/api/rooms/company/${companyName}`);
      return res.data;
    },
    initialData: roomsOfTheCurrentCompanyInit,
    refetchOnMount: true,
  });

  const { data: reservationByCompanyName } = useQuery({
    queryKey: ["reservationByCompany"],
    queryFn: async () => {
      const res = await axios.get(`/api/reservation/company/${companyName}`);
      return res.data;
    },
    initialData: reservationByCompanyNameInit,
    refetchOnMount: true,
  });
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      const res = await axios.get(`/api/company/${companyName}`);
      return res.data;
    },
    initialData: companyInit,
    refetchOnMount: true,
  });

  /*const getUserById = async (userId: string) => {
    try {
      if (userId) {
        await axios.get(`/api/invite/${userId}`);
      } else {
        console.log("Bruker ID er ikke definert");
      }
    } catch (err) {
      console.log(err);
    }
  };
  */
  /*
  useEffect(() => {
    getUserById(userId!);
*/
  useEffect(() => {
    const isCurrentUserAdmin = currentUser?.role === "admin";
    const isCurrentUserAuthorized = authorizedUsers?.find(
      (user: any) => user.userId === currentUser?.id
    );
    if (isCurrentUserAuthorized || isCurrentUserAdmin) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [authorizedUsers, currentUser]);

  if (!isAuthorized) {
    return (
      <EmptyState
        title="Uautorisert"
        subTitle="Uautorisert, du er ikke en del av dette firmaet"
      />
    );
  }

  // Show loading spinner while company data is being fetched
  if (companyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          {/* <p className="text-gray-600">Laster firma data...</p> */}
        </div>
      </div>
    );
  }

  // Only show "company does not exist" if loading is complete and no company found
  if (!company && !companyLoading) {
    return <EmptyState title="Firmaet eksisterer ikke" subTitle="" />;
  }
  if (
    company &&
    currentUser?.role == "admin" &&
    currentUser.id !== company.userId
  ) {
    return (
      <EmptyState
        title="Uautorisert"
        subTitle="Uautorisert, du er ikke en del av dette firmaet"
      />
    );
  }

  const currentDate = new Date();

  const activeEvents = reservationByCompanyName?.filter((reservation: any) => {
    const startDateString = reservation?.start_date;
    if (startDateString) {
      const startDate = new Date(startDateString);
      return startDate > currentDate;
    }
    return false;
  });

  const inactiveEvents = reservationByCompanyName?.filter(
    (reservation: any) => {
      const endDateString = reservation?.end_date;
      if (endDateString) {
        const endDate = new Date(endDateString);
        return endDate < currentDate;
      }
      return false;
    }
  );
  return (
    <div className="sm:px-10 md:px-10 lg:px-0 xl:px-0 2xl:px-0">
      <div className="relative w-full ">
        <Heading
          title={`Velkommen ${currentUser?.firstname} ${currentUser?.lastname}!`}
          subTitle="Du kan prøve HOLDAV i 14 dager kostnadsfritt! HOLDAV koster 49,- måneden."
        />
        {/*
        <Width medium>
          <Button label="Ta kontakt for å bestille systemet" small />
        </Width>
  */}
      </div>
      <div className="relative w-full">
        <Width>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 ">
            <div>
              <Card
                label="Reservasjoner"
                number={reservationByCompanyName?.length || 0}
                outline
              />
            </div>
            <div>
              <Card
                label="Brukere"
                number={authorizedUsers?.length || 0}
                outline
              />
            </div>
            <div>
              <Card
                label="Møterom"
                number={roomsOfTheCurrentCompany?.length || 0}
                outline
              />
            </div>
            {/*
            <div>
              <Card
                label="aktive bygninger"
                number={inactiveEvents?.length || 0}
                outline
              />
            </div>
  */}
          </div>
        </Width>
      </div>
      <div className="pt-10">
        {/*
        <Heading
          title="Møterom"
          subTitle="Legg til møterommene dere har i bedriften deres"
        />
        */}
        <RoomsClient
          company={company}
          roomsOfTheCurrentCompany={roomsOfTheCurrentCompany}
          currentUser={currentUser}
          companyName={companyName}
          authorizedUsers={authorizedUsers}
        />
      </div>
      <div className="relative w-full">
        <Heading title="Oppdateringer" />
        <Width>
          <div className="hidden mb-2">
            <Updates
              title="04.02.2024"
              subTitle="100% klart for bruk!"
              description="Det er et par ting som må justeres men ellers helt 100."
            />
          </div>
          <div className="mb-2">
            <Updates
              title="02.02.2024"
              subTitle="HOLD-AV ferdigstillt"
              description="Settes nå i gang med testing"
              description2="Det er fortsatt et par ting som må ordnes, brukere skal ikke kunne redigere andres reservasjoner, infoskjerm, fiks i bruker opprettelse"
            />
          </div>
        </Width>
      </div>
    </div>
  );
};

export default AdminClient;
