"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { safeUser } from "@/types";
import Button from "@/components/Button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import AddToGoogleCalendarButton from "@/components/Inputs/Calender";

interface ReservationCardProps {
  reservation?: any;
  currentUser?: safeUser | null;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  currentUser,
}) => {
  const router = useRouter();

  const onCancelReservation = async (id: any) => {
    setIsLoading(true);

    try {
      await axios.delete(`/api/reservation/${id}`);
      toast.success("Reservasjon kansellert");
      router.refresh();
    } catch (error: any) {
      toast.error("Noe gikk galt..");
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (inputDate: any) => {
    const formattedDate = new Date(inputDate).toLocaleString("no-NO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",

      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    return formattedDate;
  };

  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="w-full col-span-1 py-3 group">
      <div className="flex flex-col w-full gap-2 p-6 border rounded-md bg-light/10 border-primary">
        {/*
        <div className="relative w-full overflow-hidden aspect-square rounded-xl">
          <Image
            fill
            className="object-cover w-full h-full transition group-hover:scale-110"
            src="https://img.freepik.com/free-vector/elegant-2024-new-year-annual-calendar-design-vector_1055-19359.jpg?size=626&ext=jpg&ga=GA1.1.1965427455.1684397966&semt=sph"
            alt="Reservation"
          />
        </div>
        */}
        <div className="flex w-full">
          <div className="font-light text-[13px]">{reservation?.text}</div>
        </div>
        <hr />
        <div className="flex flex-row items-center justify-between gap-1">
          <div className="font-semibold text-[14px]">Møterom: </div>
          <div className="font-light text-[13px]">
            {reservation?.roomName || ""}
          </div>
        </div>
        <hr />
        <div className="flex flex-row items-center justify-between gap-1">
          <div className="font-semibold text-[14px]">Fra: </div>
          <div className="font-light text-[13px]">
            {formatDate(reservation?.start_date)}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between gap-1">
          <div className="font-semibold text-[14px]">Til: </div>
          <div className="font-light text-[13px]">
            {formatDate(reservation?.end_date)}
          </div>
        </div>
        <hr />

        <AddToGoogleCalendarButton
          eventTitle={reservation?.text || "Hold-Av Reservasjon"}
          startDate={reservation?.start_date || ""}
          endDate={reservation?.end_date || ""}
          eventDetails={`Rom: ${reservation?.room?.companyName || "Møterom"}`}
          location=""
          userEmail={currentUser?.email}
        />

        <Button
          small
          label="Kanseller Reservasjon"
          onClick={() => onCancelReservation(reservation?.id)}
        />
      </div>
    </div>
  );
};

export default ReservationCard;
