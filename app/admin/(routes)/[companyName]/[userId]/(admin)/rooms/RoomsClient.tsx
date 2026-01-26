"use client";
import Card from "@/components/Card";
import Width from "@/components/Width";
import React, { useEffect, useState } from "react";
import { LuDoorOpen } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SafeRoom, safeUser } from "@/types";
import axios from "axios";
import Heading from "@/components/Heading";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "@/components/EmptyState";
import ContentLoader from "@/components/ContentLoader";
import { formatRoomNameForDisplay, roomNameToSlug, companyNameToSlug } from "@/utils/slugUtils";

interface RoomsClientProps {
  currentUser?: any | null;
  roomsOfTheCurrentCompany?: SafeRoom[] | null;
  authorizedUsers: any | null;
  companyName?: string | null;
  company: any;
}

const RoomsClient = ({
  companyName,
  currentUser,
  company: companyInit,
  authorizedUsers: authorizedUsersInit,
  roomsOfTheCurrentCompany: roomsOfTheCurrentCompanyInit,
}: RoomsClientProps) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const { data: authorizedUsers } = useQuery({
    queryKey: ["authorizedUsers", companyName],
    queryFn: async () => {
      const res = await axios.get(`/api/authorized-users/${companyName}`);
      return res.data;
    },
    initialData: authorizedUsersInit,
    refetchOnMount: false, // Prevent immediate refetch to avoid hydration issues
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const { data: roomsOfTheCurrentCompany, isLoading: roomsLoading } = useQuery({
    queryKey: ["roomsForCompany", companyName],
    queryFn: async () => {
      const res = await axios.get(`/api/rooms/company/${companyName}`);
      return res.data;
    },
    initialData: roomsOfTheCurrentCompanyInit,
    refetchOnMount: true, // Enable refetch to get fresh data
    staleTime: 0, // Always consider data stale to ensure fresh fetches
  });
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["company", companyName],
    queryFn: async () => {
      const res = await axios.get(`/api/company/${companyName}`);
      return res.data;
    },
    initialData: companyInit,
    refetchOnMount: false, // Prevent immediate refetch
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  useEffect(() => {
    if (typeof authorizedUsers === 'undefined') return;
    const isCurrentUserAdmin = currentUser?.role === "admin";
    const isCurrentUserAuthorized = authorizedUsers?.find(
      (user: any) => user.userId === currentUser?.id
    );
    if (isCurrentUserAuthorized || isCurrentUserAdmin) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
    setAuthChecked(true);
  }, [authorizedUsers, currentUser]);

  if (!authChecked) {
    return <ContentLoader message=" møterom…" />;
  }

  if (!isAuthorized) {
    return (
      <EmptyState
        title="Uautorisert"
        subTitle="Uautorisert, du har ikke tilgang til dette firmaet"
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
    currentUser.id !== company?.userId
  ) {
    return (
      <EmptyState
        title="Uautorisert"
        subTitle="Uautorisert, du har ikke tilgang til dette firmaet"
      />
    );
  }

  // Show loading state while fetching fresh data to prevent flashing of deleted rooms
  if (roomsLoading) {
    return (
      <div>
        <Heading title="Møterom" subTitle="Her kan du se møterom dere har" />
        <Width>
          <ContentLoader />
        </Width>
      </div>
    );
  }

  return (
    <div>
      <Heading title="Møterom" subTitle="Her kan du se møterom dere har" />
      <Width>
        {roomsOfTheCurrentCompany?.length ? (
          <div>
            {roomsOfTheCurrentCompany?.map((room: any) => {
              const targetPath = `/${companyNameToSlug(companyName ?? "")}/${roomNameToSlug(room?.name ?? "")}`;
              return (
                <div
                  key={room?.id}
                  onClick={() => {
                    router.push(targetPath);
                  }}
                  className="mb-2 cursor-pointer transition hover:opacity-90 relative"
                >
                  <span className="absolute inset-0 z-[1]" />
                  <div className="mb-3">
                    <Card outline label={formatRoomNameForDisplay(room?.name)} flex icon={LuDoorOpen} />
                  </div>
                </div>
              );
            })}
            {currentUser?.role === "admin" && (
              <div
                onClick={() =>
                  router.push(
                    `/admin/${companyName}/${currentUser?.id}/rooms/slug`
                  )
                }
                className="mb-2 cursor-pointer transition hover:opacity-90 relative"
              >
                <span className="absolute inset-0 z-[1]" />
                <Card
                  outline
                  label="Legg til møterom"
                  flex
                  icon={AiOutlinePlus}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-start py-20">
            {currentUser?.role === "admin" && (
              <div
                onClick={() =>
                  router.push(
                    `/admin/${companyName}/${currentUser?.id}/rooms/slug`
                  )
                }
                className="w-full max-w-sm cursor-pointer transition hover:opacity-90 relative"
              >
                <span className="absolute inset-0 z-[1]" />
                <Card
                  outline
                  label="Legg til møterom"
                  flex
                  icon={AiOutlinePlus}
                />
              </div>
            )}
          </div>
        )}
      </Width>
    </div>
  );
};

export default RoomsClient;
