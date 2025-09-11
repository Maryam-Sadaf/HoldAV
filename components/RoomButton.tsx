"use client";
import Link from "next/link";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { formatRoomNameForDisplay } from "@/utils/slugUtils";

interface RoomButtonProps {
  room: any;
  href: string;
}

const RoomButton = ({ room, href }: RoomButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // The loading will stop when the new page loads
  };

  return (
    <Link
      href={href}
      className="mx-auto mb-2"
      onClick={handleClick}
      prefetch={true}
    >
      <div className="relative flex justify-center items-center px-4 py-2 font-bold text-center uppercase border-2 rounded text-primary border-primary hover:bg-primary hover:text-white transition-all duration-200 min-h-[44px] min-w-[140px]">
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            <span className="text-xs font-bold uppercase">Loading...</span>
          </>
        ) : (
          formatRoomNameForDisplay(room?.name)
        )}
      </div>
    </Link>
  );
};

export default RoomButton;
