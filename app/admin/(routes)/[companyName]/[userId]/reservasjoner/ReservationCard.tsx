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
  isCancelling: boolean;
  setIsCancelling: (value: boolean) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  currentUser,
  isCancelling,
  setIsCancelling,
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

      // Show success notification FIRST
      if (!hasToasted) {
        toast.success("Reservasjon kansellert");
        setHasToasted(true);
      }

      await queryClient.cancelQueries({ queryKey: ["reservationsForUserOrCompany"], exact: false });
      const previous = queryClient.getQueriesData({ queryKey: ["reservationsForUserOrCompany"], exact: false });

      // Delay the optimistic removal slightly so toast appears first
      await new Promise(resolve => setTimeout(resolve, 300));

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
        // Toast already shown in onMutate
        setIsDeleted(true);
        queryClient.invalidateQueries({ queryKey: ["reservationsForUserOrCompany"], exact: false });
        // Refresh server-side data to ensure deleted reservation doesn't reappear
        router.refresh();
      } else {
        // rollback optimistic removal if server did not delete
        if (context?.previous) {
          for (const [queryKey, data] of context.previous) {
            queryClient.setQueryData(queryKey, data);
          }
        }
        toast.error("Reservasjon finnes ikke eller er allerede kansellert");
      }
      setIsCancelling(false);
    },
    onError: (err: any, _id, context: any) => {
      // Check if it's a 404 (already deleted) - don't restore, just refresh
      if (err?.response?.status === 404 || err?.response?.status === 400) {
        // Already deleted - keep the success message, just sync UI
        setIsDeleted(true);
        router.refresh();
      } else {
        // Real error - restore the optimistic update and show error
        if (context?.previous) {
          for (const [queryKey, data] of context.previous) {
            queryClient.setQueryData(queryKey, data);
          }
        }
        // Dismiss any previous toasts and show error
        toast.dismiss();
        toast.error("Kunne ikke kansellere reservasjon");
      }
      setHasToasted(false);
      setIsCancelling(false);
    },
    onSettled: () => {
      setIsLoading(false);
      setIsCancelling(false);
    },
  });

  const onCancelReservation = async (id: any) => {
    if (!id) return;
    if (isDeleted || isLoading || deleteReservation.isPending || isCancelling) return;
    setIsLoading(true);
    setIsCancelling(true);
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
    <div className="w-full col-span-1 py-3">
      <div className="flex flex-col w-full h-80 p-6 border rounded-md border-primary">

        {/* ===== TOP CONTENT (TEXT) ===== */}
        <div className="flex-1 min-h-0">
          <div className="text-[13px] leading-snug break-words overflow-hidden line-clamp-3">
            {reservation?.text}
          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-[13px]">
            <span className="font-semibold">Møterom:</span>
            <span className="text-right text-[13px] leading-snug max-w-[60%] line-clamp-2 break-words">
              {reservation?.roomName}
            </span>

          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-[13px]">
            <span className="font-semibold">Fra:</span>
            <span>{formatDate(reservation?.start_date)}</span>
          </div>

          <div className="flex justify-between text-[13px] mt-1">
            <span className="font-semibold">Til:</span>
            <span>{formatDate(reservation?.end_date)}</span>
          </div>
        </div>

        {/* ===== FOOTER (ALWAYS BOTTOM) ===== */}
       <div className="mt-4 flex flex-col">
  <div className="mb-2">
    <AddToGoogleCalendarButton
      eventTitle={reservation?.text || "Hold-Av Reservasjon"}
      startDate={reservation?.start_date || ""}
      endDate={reservation?.end_date || ""}
      eventDetails={`Rom: ${reservation?.room?.companyName || "Møterom"}`}
      location=""
      userEmail={currentUser?.email}
    />
  </div>

  <Button
    small
    label={isDeleted ? "Kansellert" : "Kanseller Reservasjon"}
    onClick={() => onCancelReservation(reservation?.id)}
    disabled={isDeleted || isLoading || deleteReservation.isPending || isCancelling}
    loading={isLoading}
    loadingLabel="Kansellerer..."
  />
</div>

      </div>
    </div>
  );

};

export default ReservationCard;
