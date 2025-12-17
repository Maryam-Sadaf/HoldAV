"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Scheduler from "@/components/ui/Scheduler";
import Toolbar from "@/components/ui/Toolbar";
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
import "./Scheduler.css";

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
  const [reservationsState, setReservationsState] = useState<any[]>(
    Array.isArray(reservationsByRomName) ? reservationsByRomName : []
  );
  const selectedDatesRef = useRef({ start_date: "", end_date: "" });
  // Track initial mount to prevent overwriting optimistic updates
  const isInitialMountRef = useRef(true);

  const [formData, setFormData] = useState({
    text: "",
  });
  const [isReservation, setIsReservation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [currentTimeFormatState, setCurrentTimeFormatState] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const DynamicScheduler = dynamic(
    () => import("@/components/ui/Scheduler"),
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
    const newReservations = Array.isArray(reservationsByRomName) ? reservationsByRomName : [];
    
    // On initial mount, set the state
    if (isInitialMountRef.current) {
      setReservationsState(newReservations);
      isInitialMountRef.current = false;
      return;
    }
    
    // After initial mount, only merge new reservations from server
    // This prevents overwriting optimistic updates during reservation creation
    setReservationsState((prev) => {
      const prevMap = new Map(prev.map((r: any) => [String(r.id), r]));
      // Add/update from server data, but don't remove optimistic updates
      newReservations.forEach((r: any) => {
        prevMap.set(String(r.id), r);
      });
      return Array.from(prevMap.values());
    });
  }, [reservationsByRomName]);

  // Use ref to track previous dates to prevent unnecessary recalculations
  const previousDatesRef = useRef<string>('');
  
  useEffect(() => {
    const source = Array.isArray(reservationsState) ? reservationsState : [];
    
    if (source.length === 0) {
      // Only update if dates is not already empty
      if (dates.length > 0) {
        setDates([]);
      }
      return;
    }

    const currentRoomId = roomByName?.id ? String(roomByName.id).trim() : null;
    const currentRoomNameLc = (roomByName?.name || "").toString().trim().toLowerCase();
    const routeRoomNameLc = (roomNameParam || "").toString().trim().toLowerCase();

    if (!currentRoomId && !currentRoomNameLc && !routeRoomNameLc) {
      // If no identifiers, show all (shouldn't happen but fallback)
      const datesArray = source.map((r: any) => ({
        id: r.id,
        start_date: new Date(r.start_date),
        end_date: new Date(r.end_date),
        text: r.text || "",
      }));
      // Only update if content actually changed
      const datesKey = datesArray.map(d => `${d.id}-${d.start_date.getTime()}-${d.end_date.getTime()}`).join('|');
      if (previousDatesRef.current !== datesKey) {
        previousDatesRef.current = datesKey;
        setDates(datesArray);
      }
      return;
    }

    const filtered = source.filter((r: any) => {
      const rid = r?.roomId ? String(r.roomId).trim() : null;
      const rname = (r?.roomName || "").toString().trim();
      const rnameLc = rname.toLowerCase();
      
      // Match by roomId first (most reliable)
      if (currentRoomId && rid && rid === currentRoomId) {
        return true;
      }
      
      // Match by room name (exact lowercase match)
      if (currentRoomNameLc && rnameLc && rnameLc === currentRoomNameLc) {
        return true;
      }
      
      // Match by route room name (normalized comparison)
      if (routeRoomNameLc && rnameLc) {
        // Normalize both: remove hyphens, normalize spaces, lowercase
        const normalize = (str: string) => str.replace(/-/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
        const normalizedRoute = normalize(routeRoomNameLc);
        const normalizedReservation = normalize(rname);
        
        if (normalizedReservation === normalizedRoute) {
          return true;
        }
      }
      
      return false;
    });
    
    // Convert to dates format
    const datesArray = filtered.map((r: any) => ({
      id: r.id,
      start_date: new Date(r.start_date),
      end_date: new Date(r.end_date),
      text: r.text || "",
    }));
    
    // Only update if content actually changed (prevent unnecessary Scheduler re-renders)
    const datesKey = datesArray.map(d => `${d.id}-${d.start_date.getTime()}-${d.end_date.getTime()}-${d.text}`).join('|');
    if (previousDatesRef.current !== datesKey) {
      previousDatesRef.current = datesKey;
      setDates(datesArray);
    }
  }, [reservationsState, roomByName?.id, roomByName?.name, roomNameParam]);
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
      setIsReservation(false);
      
      // Update reservations state with the newly created reservation
      if (createdId) {
        const createdReservation = response?.data?.reservations?.[0];
        if (createdReservation) {
          setReservationsState((prev) => [...prev, createdReservation]);
        } else {
          setReservationsState((prev) => [
            ...prev,
            {
              id: createdId,
              roomId: ensuredRoomId,
              roomName: ensuredRoomName,
              start_date: requestData.start_date,
              end_date: requestData.end_date,
              text: requestData.text,
            },
          ]);
        }
      }
      
      return { id: createdId };
      // Toast is now handled by Scheduler component
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
    roomNameParam,
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
      setReservationsState((prev) =>
        prev.map((reservation: any) =>
          String(reservation.id) === String(id)
            ? {
                ...reservation,
                start_date: formattedStartDate,
                end_date: formattedEndDate,
                text: updatedData.text ?? reservation.text,
              }
            : reservation
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
    if (!id) return;
    if (!isCancelling) {
      setIsCancelling(true);
    }
    try {
      await axios.delete(`/api/reservation/${id}`);
      
      // Update reservations state by removing the deleted reservation
      setReservationsState((prev) =>
        prev.filter((reservation: any) => String(reservation.id) !== String(id))
      );
      
      // Toast is now handled by Scheduler component
    } catch (error: any) {
      // Re-throw error so Scheduler component can handle it
      throw error;
    } finally {
      setIsCancelling(false);
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
    <div className="w-full min-h-[600px] md:h-full md:min-h-screen">
      <div className="hidden tool-bar">
        <Toolbar
          timeFormatState={currentTimeFormatState}
          onTimeFormatStateChange={handleTimeFormatStateChange}
        />
      </div>
      <div className="scheduler_container overflow-auto">
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
          isCancelling={isCancelling}
          setIsCancelling={setIsCancelling}
        />
      </div>
    </div>
  );
};

export default Reservation;
