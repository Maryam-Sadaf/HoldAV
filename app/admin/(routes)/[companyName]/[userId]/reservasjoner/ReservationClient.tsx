"use client";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReservationCard from "./ReservationCard";
import axios from "axios";
import Heading from "@/components/Heading";
import EmptyState from "@/components/EmptyState";
import AddToGoogleCalendarButton from "@/components/Inputs/Calender";
import { formatDuration, formatTimeRange } from "@/utils/timeFormat";
import ContentLoader from "@/components/ContentLoader";

interface ReservationsClientProps {
  reservations: any;
  currentUser?: any | null;
  companyName?: string | null;
  disableRefetch?: boolean;
  isInfoScreen?: boolean;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations: reservationsInit,
  currentUser,
  companyName,
  disableRefetch = false,
  isInfoScreen = false,
}) => {
  const { data: reservations, isLoading, isFetching } = useQuery({
    queryKey: ["reservationsForUserOrCompany", currentUser?.role, companyName, currentUser?.id],
    queryFn: async () => {
      if (currentUser?.role === 'admin') {
        const res = await axios.get(`/api/reservation/company/${companyName}?_t=${Date.now()}`);
        return res.data;
      }
      const res = await axios.get(`/api/reservation/user/${currentUser.id}?_t=${Date.now()}`);
      return res.data;
    },
    // Always refresh when mounting and after deletes to avoid stale cache
    initialData: reservationsInit,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    enabled: true,
  });

  // Local list to ensure immediate UI updates even if network/browser caches
  const [list, setList] = useState<any[]>(Array.isArray(reservationsInit) ? reservationsInit : []);
  useEffect(() => {
    if (Array.isArray(reservations)) {
      setList(reservations);
    }
  }, [reservations]);

  // Kiosk-style Info Screen Layout for today's reservations
  if (isInfoScreen) {
    const loading = isLoading || isFetching;
    if (loading) {
      return (
        <div className="p-6">
          <ContentLoader />
        </div>
      );
    }
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow
    
    // Filter reservations to only show today's reservations
    const todaysReservations = reservations.filter((reservation: any) => {
      const startDate = new Date(reservation.start_date);
      return startDate >= today && startDate < tomorrow;
    });
    
    // Filter to show only upcoming reservations (start_time >= current time today)
    const upcomingReservations = todaysReservations.filter((reservation: any) => {
      const startDate = new Date(reservation.start_date);
      return startDate >= now; // Show if meeting hasn't started yet or is starting now
    });
    
    const sortedReservations = [...upcomingReservations].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    
    // Check current room status and find next meeting for top card
    const currentMeeting = sortedReservations.find(r => {
      const start = new Date(r.start_date);
      const end = new Date(r.end_date);
      return now >= start && now <= end;
    });
    
    // For top card: show current meeting or next upcoming meeting
    const nextMeeting = currentMeeting || sortedReservations[0]; // First upcoming meeting
    
    // For the list below: show remaining upcoming meetings (excluding the one in top card)
    const remainingUpcomingReservations = sortedReservations.filter(r => r.id !== nextMeeting?.id);
    
    return (
      <div className="min-h-screen bg-white text-gray-900">
        {/* Header with Time and Date - Clean */}
        <div className="p-6">
          <div className="text-center">
            <div className="text-4xl font-light text-gray-900 mb-2">
              {now.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-lg text-gray-600">
              {now.toLocaleDateString('no-NO', { 
                weekday: 'long', 
                day: 'numeric',
                month: 'long'
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6">
          {/* Next Upcoming Meeting Card - Highlighted */}
          {nextMeeting && (
            <div className="rounded-2xl p-6 mb-6 border border-indigo-700/50 bg-[#4F518C]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-indigo-200 text-xs font-medium mb-2 uppercase tracking-wide">
                    {currentMeeting ? 'Current Meeting' : 'Upcoming Meeting'}
                  </div>
                  <div className="text-2xl font-semibold mb-2 text-white">{nextMeeting.text}</div>
                  <div className="text-indigo-100 text-sm mb-2">{nextMeeting.roomName}</div>
                  <div className="text-lg text-white mb-1">
                    {formatTimeRange(nextMeeting.start_date, nextMeeting.end_date)}
                  </div>
                  <div className="text-indigo-100 text-sm">
                    Duration: {formatDuration(nextMeeting.start_date, nextMeeting.end_date)}
                  </div>
                  <div className="text-indigo-100 mt-1 text-sm">
                    {(() => {
                      const meetingStart = new Date(nextMeeting.start_date);
                      const meetingEnd = new Date(nextMeeting.end_date);
                      
                      if (currentMeeting) {
                        const minutesLeft = Math.round((meetingEnd.getTime() - now.getTime()) / (1000 * 60));
                        return `Ends in ${minutesLeft} minutes`;
                      } else {
                        const minutesUntil = Math.round((meetingStart.getTime() - now.getTime()) / (1000 * 60));
                        return `Starts in ${minutesUntil} minutes`;
                      }
                    })()}
                  </div>
                </div>
                <div className="text-right">
                  <AddToGoogleCalendarButton
                    eventTitle={nextMeeting?.text || "Hold-Av Reservasjon"}
                    startDate={nextMeeting?.start_date || ""}
                    endDate={nextMeeting?.end_date || ""}
                    eventDetails={`Rom: ${nextMeeting?.roomName || "Møterom"}`}
                    location=""
                    userEmail={currentUser?.email}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Remaining Upcoming Reservations - Timeline Format */}
          {remainingUpcomingReservations.length > 0 && (
            <div className="rounded-2xl p-6 border border-indigo-700/50 bg-[#4F518C]">
              <div className="text-white text-xs font-medium mb-4 uppercase tracking-wide">Upcoming Reservations</div>
              <div className="space-y-3">
                {remainingUpcomingReservations.map((reservation: any) => {
                  const startTime = new Date(reservation.start_date);
                  const endTime = new Date(reservation.end_date);
                  const isCurrentMeeting = now >= startTime && now <= endTime;
                  
                  return (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-3 rounded-xl  border border-white "
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-[70px]">
                          <div className="text-base font-semibold text-white">
                            {startTime.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-xs text-indigo-100">
                            {endTime.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-medium text-white">{reservation.text}</div>
                          <div className="text-indigo-100 text-sm mb-1">{reservation.roomName}</div>
                          <div className="text-indigo-100 text-xs">
                            {formatDuration(reservation.start_date, reservation.end_date)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isCurrentMeeting && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 font-medium text-xs">LIVE</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No upcoming meetings - Clean Theme */}
          {sortedReservations?.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-2xl font-light text-gray-800 mb-1">No upcoming meetings</div>
              <div className="text-gray-500 text-sm">All meetings for today have been completed</div>
            </div>
          )}
        </div>

        {/* Footer - Clean Theme */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <div>Room Management System</div>
            
          </div>
        </div>
      </div>
    );
  }

  // Original layout for regular reservations page
  // While fetching, show the project's existing loader instead of stale data
  if (!isInfoScreen && (isLoading || isFetching)) {
    return (
      <div>
        <Heading title="Reservasjoner" subTitle={currentUser?.role === 'admin' ? 'Her kan du se alle reservasjoner' : 'Her kan du se dine reservasjoner'} />
        <Container>
          <ContentLoader />
        </Container>
      </div>
    );
  }

  if (list?.length === 0) {
    return (
      <EmptyState
        title="Ingen reservasjoner funnet"
        subTitle="Ser ikke ut til at du har noen reservasjoner enda."
      />
    );
  }

  return (
    <Container>
      {/*<Navbar Logo navMenu currentUser={currentUser} />*/}
      <Heading
        title="Reservasjoner"
        subTitle={currentUser?.role === 'admin' ? 'Her kan du se alle reservasjoner' : 'Her kan du se dine reservasjoner'}
      />
      <div className="grid grid-cols-1 gap-8 py-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {list.map((reservation: any) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default ReservationsClient;
