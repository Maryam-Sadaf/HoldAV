"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import RoomButton from "./RoomButton";
import { roomNameToSlug, companyNameToSlug } from "@/utils/slugUtils";

interface RoomsListProps {
  rooms: any[];
  routes: any;
}

const RoomsList = ({ rooms, routes }: RoomsListProps) => {
  const router = useRouter();

  // Preload room pages for faster navigation
  useEffect(() => {
    if (rooms && routes) {
      rooms.forEach((room) => {
        const href = `/${companyNameToSlug(
          routes?.creator?.firmanavn || routes?.company?.firmanavn || ""
        )}/${roomNameToSlug(room?.name || "")}`;
        
        // Preload the page
        router.prefetch(href);
      });
    }
  }, [rooms, routes, router]);

  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full border-t border-b border-primary">
      <div className="flex flex-row flex-wrap items-center justify-center w-full px-8 py-6 gap-x-12 gap-y-4">
        {rooms.map((room) => (
          <RoomButton
            key={room?.id}
            room={room}
            href={`/${companyNameToSlug(
              routes?.creator?.firmanavn || routes?.company?.firmanavn || ""
            )}/${roomNameToSlug(room?.name || "")}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomsList;
