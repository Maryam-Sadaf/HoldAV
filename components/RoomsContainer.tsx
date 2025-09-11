"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RoomsSection from "./RoomsSection";
import { roomNameToSlug, companyNameToSlug } from "@/utils/slugUtils";

interface RoomsContainerProps {
  rooms: any[] | null | undefined;
  routes: any;
}

const RoomsContainer = ({ rooms, routes }: RoomsContainerProps) => {
  const router = useRouter();

  // Preload room pages for faster navigation
  useEffect(() => {
    if (rooms && routes && rooms.length > 0) {
      rooms.forEach((room) => {
        const href = `/${companyNameToSlug(
          routes?.creator?.firmanavn || routes?.company?.firmanavn || ""
        )}/${roomNameToSlug(room?.name || "")}`;
        
        // Preload the page
        router.prefetch(href);
      });
    }
  }, [rooms, routes, router]);

  return <RoomsSection rooms={rooms} routes={routes} />;
};

export default RoomsContainer;
