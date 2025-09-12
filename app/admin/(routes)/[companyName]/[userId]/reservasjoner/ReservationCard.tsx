"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { safeUser } from "@/types";
import Button from "@/components/Button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import AddToGoogleCalendarButton from "@/components/Inputs/Calender";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReservationCardProps {
  reservation?: any;
  currentUser?: safeUser | null;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  currentUser,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [hasToasted, setHasToasted] = useState(false);

  const deleteReservation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/reservation/${id}`);
      return res.data;
    },
    onMutate: async (id: string) => {
      setIsLoading(true);
      await queryClient.cancelQueries({ queryKey: ["reservationsForUserOrCompany"], exact: false });
      const previous = queryClient.getQueriesData({ queryKey: ["reservationsForUserOrCompany"], exact: false });

      const removeFromData = (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) return old.filter((r: any) => r?.id !== id);
        if (Array.isArray(old?.pages)) {
          return {
            ...old,
            pages: old.pages.map((p: any) => Array.isArray(p)
              ? p.filter((r: any) => r?.id !== id)
              : Array.isArray(p?.items)
                ? { ...p, items: p.items.filter((r: any) => r?.id !== id) }
                : p
            )
          };
        }
        if (Array.isArray(old?.items)) {
          return { ...old, items: old.items.filter((r: any) => r?.id !== id) };
        }
        return old;
      };

      queryClient.setQueriesData({ queryKey: ["reservationsForUserOrCompany"], exact: false }, removeFromData);
      // Also update the local list maintained by ReservationsClient
      queryClient.setQueriesData({ queryKey: ["reservationsForUserOrCompany", undefined], exact: false }, (old: any) => old);
      return { previous } as any;
    },
    onSuccess: (data: any, id: string, context: any) => {
      const count = typeof data?.count === 'number' ? data.count : (typeof data?.deletedCount === 'number' ? data.deletedCount : 0);
      if (count > 0) {
        if (!hasToasted) {
          toast.success("Reservasjon kansellert");
          setHasToasted(true);
        }
        setIsDeleted(true);
        queryClient.invalidateQueries({ queryKey: ["reservationsForUserOrCompany"], exact: false });
      } else {
        // rollback optimistic removal if server did not delete
        if (context?.previous) {
          for (const [queryKey, data] of context.previous) {
            queryClient.setQueryData(queryKey, data);
          }
        }
        toast.error("Reservasjon finnes ikke eller er allerede kansellert");
      }
    },
    onError: (_err, _id, context: any) => {
      if (context?.previous) {
        for (const [queryKey, data] of context.previous) {
          queryClient.setQueryData(queryKey, data);
        }
      }
      toast.error("Noe gikk galt..");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onCancelReservation = async (id: any) => {
    if (isDeleted || isLoading || deleteReservation.isPending) return;
    setIsLoading(true);
    deleteReservation.mutate(id);
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

  if (isDeleted) {
    return null;
  }

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
          label={isDeleted ? "Kansellert" : "Kanseller Reservasjon"}
          onClick={() => onCancelReservation(reservation?.id)}
          // Disabled state to avoid double clicks while deleting
          disabled={isDeleted || isLoading || deleteReservation.isPending}
        />
      </div>
    </div>
  );
};

export default ReservationCard;
