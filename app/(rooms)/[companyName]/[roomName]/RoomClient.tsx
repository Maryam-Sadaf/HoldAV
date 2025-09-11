"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Scheduler from "../../../../components/ui/Scheduler";
import Toolbar from "../../../../components/ui/Toolbar";
import { toast } from "react-hot-toast";
import { SafeRoom, safeUser } from "@/types";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Width from "@/components/Width";
import EmptyState from "@/components/EmptyState";
import { formatISO } from "date-fns";
import Image from "next/image";
import { metting } from "@/assets";
import ContentLoader from "@/components/ContentLoader";
import dynamic from "next/dynamic";

interface Message {
  message: any;
}
interface Dates {
  id: string;
  start_date: Date;
  end_date: Date;
  text: string;
}
interface RoomClientProps {
  authorizedUsers: any;
  reservations?: any[];
  reservationsByRomName?: any[];
  currentUser?: any | null;
  roomByName?: any | null;
  //creatorByCompanyName?: any | null;
}
const Reservation = ({
  currentUser,
  roomByName,
  reservationsByRomName = [],
  authorizedUsers = [],
}: RoomClientProps) => {
  const router = useRouter();
  const [selectedDates, setSelectedDates] = useState({
    start_date: "",
    end_date: "",
  });
  const [dates, setDates] = useState<Dates[]>([]);
  const selectedDatesRef = useRef({ start_date: "", end_date: "" });

  const [formData, setFormData] = useState({
    text: "",
  });
  const [isReservation, setIsReservation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTimeFormatState, setCurrentTimeFormatState] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const DynamicScheduler = dynamic(
    () => import("../../../../components/ui/Scheduler"),
    {
      ssr: false,
    }
  );
  const routeParams = useParams<{ companyName: string; roomName: string }>();
  const companyName = routeParams ? routeParams.companyName : null;
  const roomNameParam = routeParams ? routeParams.roomName : null;
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    // Wait until we have an authorizedUsers value before deciding
    if (typeof authorizedUsers === "undefined") return;
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

  useEffect(() => {
    setDates(reservationsByRomName);
  }, [reservationsByRomName]);
  const addMessage = (message: any) => {
    const maxLogLength = 5;
    const newMessage = { message };
    const newMessages = [newMessage, ...messages];

    if (newMessages.length > maxLogLength) {
      newMessages.length = maxLogLength;
    }
    setMessages(newMessages);
  };
  const handleTimeFormatStateChange = (state: any) => {
    setCurrentTimeFormatState(state);
  };

  const logDataUpdate = (action: any, ev: any, id: any) => {
    const text = ev && ev.text ? ` (${ev.text})` : "";
    const start_date = ev.start_date;
    const end_date = ev.end_date;
    setSelectedDates({ start_date, end_date });
    const message = `event ${action}: ${id} ${text}`;
    addMessage(message);
  };

  const onCreateReservation = useCallback(async (payload?: { start_date: Date; end_date: Date; text: string }) => {
    const { start_date, end_date } = selectedDatesRef.current;
    if (!start_date || !end_date) {
      return;
    }
    const calculateDuration = (startDateTime: string | Date, endDateTime: string | Date) => {
      const start_date = new Date(startDateTime as any);
      const end_date = new Date(endDateTime as any);

      if (isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
        throw new Error("Ugyldig dato string");
      }

      const durationInMilliseconds = end_date.getTime() - start_date.getTime();
      const minutes = Math.floor(durationInMilliseconds / (1000 * 60));
      return minutes;
    };

    const createdByText = payload?.text ?? formData.text;

    // Ensure room identifiers are present in the payload
    const ensuredRoomId = roomByName?.id;
    const ensuredRoomName = (roomByName?.name || roomNameParam || "");
    if (!ensuredRoomId || !ensuredRoomName) {
      throw new Error("Room information not available yet. Please try again.");
    }

    const requestData = {
      start_date: payload?.start_date ?? start_date,
      end_date: payload?.end_date ?? end_date,
      text: createdByText,
      roomId: ensuredRoomId,
      roomName: ensuredRoomName,
      companyName: companyName,
      duration: calculateDuration(payload?.start_date ?? start_date, payload?.end_date ?? end_date).toString(),
    };

    try {
      setIsLoading(true);
      const response = await axios.post("/api/reservation", requestData);
      // Return the created reservation id so Scheduler can swap temp id
      const createdId = response?.data?.reservations?.[0]?.id || response?.data?.id;
      return { id: createdId };
      // Toast is now handled by Scheduler component
      //router.push(`/${companyName}/reservasjoner`);
      setIsReservation(false);
    } catch (error) {
      console.error("Feil ved reservering:", error);
      // Re-throw error so Scheduler component can handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedDates,
    formData,
    roomByName,
    companyName,
    //router,
    setIsReservation,
    //creatorByCompanyName?.userId,
  ]);

  const onUpdateReservation = async (id: string, updatedData: any) => {
    const formattedStartDate = formatISO(new Date(updatedData.start_date));
    const formattedEndDate = formatISO(new Date(updatedData.end_date));

    try {
      setIsLoading(true);
      await axios.put(`/api/reservation/${id}`, {
        ...updatedData,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      });
      // Optimistically update local state so Scheduler reflects changes immediately
      setDates((prev) =>
        prev.map((evt) =>
          String(evt.id) === String(id)
            ? {
                ...evt,
                start_date: new Date(updatedData.start_date),
                end_date: new Date(updatedData.end_date),
                text: updatedData.text ?? evt.text,
              }
            : evt
        )
      );
      // No toast here; Scheduler shows feedback already
    } catch (error: any) {
      // Re-throw error so Scheduler component can handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const onCancelReservation = async (id: any) => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/reservation/${id}`);
      // Toast is now handled by Scheduler component
      router.refresh();
    } catch (error: any) {
      // Re-throw error so Scheduler component can handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const handleDateSelect = (
    start_date: string,
    end_date: string,
    text: string = ""
  ) => {
    selectedDatesRef.current = { start_date, end_date };
    setSelectedDates({
      start_date,
      end_date,
    });
    setFormData({ text: text || "" });
  };
  // useEffect(() => {
  //   if (isReservation && selectedDates.start_date && selectedDates.end_date) {
  //     onCreateReservation();
  //   }
  // }, [isReservation]);

  // Reservation submission is handled directly by the Scheduler via onSubmit
  // to avoid duplicate POST requests. Do not auto-submit here.
  if (!currentUser) {
    return (
      <EmptyState
        title="Uautorisert"
        subTitle="Uautorisert, vennligst logg inn"
      />
    );
  }
  // While authorization is being determined, show a lightweight loader to avoid flicker
  if (!authChecked) {
    return <ContentLoader message="Laster møterom…" />;
  }

  if (!isAuthorized) {
    return (
      <EmptyState
        title="Uautorisert"
        subTitle="Uautorisert, du har ikke tilgang til dette firmaet"
      />
    );
  }

  return (
    <div className="w-full h-full min-h-screen">
      <div className="hidden tool-bar">
        <Toolbar
          timeFormatState={currentTimeFormatState}
          onTimeFormatStateChange={handleTimeFormatStateChange}
        />
      </div>
      <div className="scheduler_container">
        <DynamicScheduler
          dates={dates}
          timeFormatState={currentTimeFormatState}
          onDataUpdated={logDataUpdate}
          onSubmit={onCreateReservation}
          onDateSelect={handleDateSelect}
          onUpdateReservation={onUpdateReservation}
          setIsReservation={setIsReservation}
          onCancelReservation={onCancelReservation}
          currentUser={currentUser}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Reservation;
