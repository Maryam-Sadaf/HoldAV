"use client";

import React, { useCallback, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { DateSelectArg, EventClickArg, EventChangeArg, EventDropArg } from "@fullcalendar/core";
import { toast } from "react-hot-toast";
import { formatISO } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    text?: string;
    userId?: string;
    userName?: string;
  };
}

interface ModernCalendarProps {
  events: CalendarEvent[];
  timeFormatState: boolean;
  onDataUpdated?: (action: string, event: any, id: string) => void;
  onSubmit: () => void;
  onUpdateReservation: (id: string, isUpdate: any) => void;
  onCancelReservation: (id: string) => void;
  setIsReservation: any;
  onDateSelect: (startDate: string, endDate: string, eventName: string) => void;
  currentUser?: any | null;
  isLoading?: boolean;
}

const ModernCalendar: React.FC<ModernCalendarProps> = ({
  events,
  timeFormatState,
  onDataUpdated,
  onSubmit,
  onUpdateReservation,
  onCancelReservation,
  setIsReservation,
  onDateSelect,
  currentUser,
  isLoading = false,
}) => {
  const FullCalendarAny = FullCalendar as any;
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedDates, setSelectedDates] = useState<DateSelectArg | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [currentView, setCurrentView] = useState("timeGridWeek");

  // Convert events to FullCalendar format
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    backgroundColor: event.backgroundColor || "#3b82f6",
    borderColor: event.borderColor || "#2563eb",
    textColor: event.textColor || "#ffffff",
    extendedProps: event.extendedProps,
  }));

  // Handle date selection for creating new events
  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    const startDate = selectInfo.start;
    const endDate = selectInfo.end;
    
    // Check if selection is in the past
    if (startDate < new Date()) {
      toast.error("Du kan ikke reservere i fortiden");
      return;
    }

    setSelectedDates(selectInfo);
    setEventTitle(`${currentUser?.firstname} ${currentUser?.lastname}` || "Reservasjon");
    setEventDescription("");
    setIsCreateDialogOpen(true);
  }, [currentUser]);

  // Handle event click for editing/deleting
  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const eventData: CalendarEvent = {
      id: event.id,
      title: event.title,
      start: event.start!,
      end: event.end!,
      extendedProps: event.extendedProps,
    };

    // Check if user can edit this event
    if (event.extendedProps?.userId && currentUser?.id !== event.extendedProps.userId) {
      toast.error("Du kan kun redigere dine egne reservasjoner");
      return;
    }

    setSelectedEvent(eventData);
    setEventTitle(event.title);
    setEventDescription(event.extendedProps?.text || "");
    setIsEditDialogOpen(true);
  }, [currentUser]);

  // Handle event drop/resize
  const handleEventChange = useCallback((changeInfo: EventChangeArg) => {
    const event = changeInfo.event;
    
    // Check if user can edit this event
    if (event.extendedProps?.userId && currentUser?.id !== event.extendedProps.userId) {
      toast.error("Du kan kun redigere dine egne reservasjoner");
      changeInfo.revert();
      return;
    }

    // Check if new time is in the past
    if (event.start! < new Date()) {
      toast.error("Du kan ikke flytte reservasjoner til fortiden");
      changeInfo.revert();
      return;
    }

    const updatedData = {
      start_date: event.start!,
      end_date: event.end!,
      text: event.extendedProps?.text || event.title,
    };

    onUpdateReservation(event.id, updatedData);
    
    if (onDataUpdated) {
      onDataUpdated("update", {
        start_date: event.start!,
        end_date: event.end!,
        text: event.extendedProps?.text || event.title,
      }, event.id);
    }
  }, [currentUser, onUpdateReservation, onDataUpdated]);

  // Create new event
  const handleCreateEvent = useCallback(async () => {
    if (!selectedDates || !eventTitle.trim()) {
      toast.error("Vennligst fyll ut alle felt");
      return;
    }

    setIsReservation(true);
    onDateSelect(
      formatISO(selectedDates.start),
      formatISO(selectedDates.end),
      eventTitle
    );

    if (onDataUpdated) {
      onDataUpdated("create", {
        start_date: selectedDates.start,
        end_date: selectedDates.end,
        text: eventTitle,
      }, "");
    }

    onSubmit();
    setIsCreateDialogOpen(false);
    setSelectedDates(null);
    setEventTitle("");
    setEventDescription("");
  }, [selectedDates, eventTitle, setIsReservation, onDateSelect, onDataUpdated, onSubmit]);

  // Update existing event
  const handleUpdateEvent = useCallback(async () => {
    if (!selectedEvent || !eventTitle.trim()) {
      toast.error("Vennligst fyll ut alle felt");
      return;
    }

    const updatedData = {
      start_date: selectedEvent.start,
      end_date: selectedEvent.end,
      text: eventDescription || eventTitle,
    };

    onUpdateReservation(selectedEvent.id, updatedData);
    
    if (onDataUpdated) {
      onDataUpdated("update", updatedData, selectedEvent.id);
    }

    setIsEditDialogOpen(false);
    setSelectedEvent(null);
    setEventTitle("");
    setEventDescription("");
  }, [selectedEvent, eventTitle, eventDescription, onUpdateReservation, onDataUpdated]);

  // Delete event
  const handleDeleteEvent = useCallback(async () => {
    if (!selectedEvent) return;

    onCancelReservation(selectedEvent.id);
    
    if (onDataUpdated) {
      onDataUpdated("delete", selectedEvent, selectedEvent.id);
    }

    setIsDeleteDialogOpen(false);
    setSelectedEvent(null);
  }, [selectedEvent, onCancelReservation, onDataUpdated]);

  // Calendar configuration
  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: currentView,
    headerToolbar: false, // Hide default header
    locale: "en",
    firstDay: 1, // Monday
    slotMinTime: "00:00:00",
    slotMaxTime: "23:45:00",
    slotDuration: "01:00:00",
    snapDuration: "00:15:00",
    height: "auto",
    selectable: true,
    selectMirror: true,
    editable: true,
    droppable: true,
    dayMaxEvents: true,
    weekends: true,
    nowIndicator: false,
    select: handleDateSelect,
    eventClick: handleEventClick,
    eventChange: handleEventChange,
    events: calendarEvents,
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
    dayHeaderFormat: { weekday: 'short', month: 'short' },
    dayHeaderDidMount: (info: any) => {
      const date = info.date;
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today.setHours(0, 0, 0, 0);
      
      if (isPast) {
        info.el.style.color = '#9ca3af';
        info.el.style.backgroundColor = '#f9fafb';
      } else if (isToday) {
        info.el.style.color = '#2563eb';
        info.el.style.fontWeight = '600';
      }
    },
    dayCellDidMount: (info: any) => {
      const date = info.date;
      const today = new Date();
      const isPast = date < today.setHours(0, 0, 0, 0);
      
      if (isPast) {
        info.el.style.backgroundColor = '#f9fafb';
        info.el.style.color = '#9ca3af';
      }
    },
    eventClassNames: (arg: any) => {
      const event = arg.event;
      const isPast = event.start < new Date();
      const isOwnEvent = event.extendedProps?.userId === currentUser?.id;
      
      return [
        "cursor-pointer transition-all duration-200 hover:shadow-sm",
        isPast && "opacity-60",
        !isOwnEvent && "cursor-not-allowed opacity-75"
      ].filter(Boolean).join(" ");
    },
    eventContent: (arg: any) => {
      const event = arg.event;
      const isOwnEvent = event.extendedProps?.userId === currentUser?.id;
      
      return {
        html: `
          <div class="fc-event-main-frame p-1">
            <div class="fc-event-title-container">
              <div class="fc-event-time font-semibold text-xs text-white mb-1">
                ${event.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - ${event.end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div class="fc-event-title text-xs font-medium text-white ${!isOwnEvent ? 'opacity-75' : ''}">
                ${event.title}
              </div>
            </div>
          </div>
        `,
      };
    },
  };

  // Get current date range for display
  const getCurrentDateRange = () => {
    const calendar = calendarRef.current?.getApi();
    if (!calendar) return "Sep 1, 2025 – Sep 7, 2025";
    
    const view = calendar.view;
    const start = view.activeStart;
    const end = view.activeEnd;
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    };
    
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  return (
    <div className="w-full h-full bg-white">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        {/* First Row: Navigation and Date Range */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                const calendar = calendarRef.current?.getApi();
                calendar?.prev();
              }}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              &lt;
            </button>
            <button 
              onClick={() => {
                const calendar = calendarRef.current?.getApi();
                calendar?.today();
              }}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              TODAY
            </button>
            <button 
              onClick={() => {
                const calendar = calendarRef.current?.getApi();
                calendar?.next();
              }}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              &gt;
            </button>
          </div>
          
          <div className="text-sm font-semibold text-gray-900">
            {getCurrentDateRange()}
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentView("timeGridDay")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                currentView === "timeGridDay" 
                  ? "bg-blue-500 text-white" 
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              DAY
            </button>
            <button
              onClick={() => setCurrentView("timeGridWeek")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                currentView === "timeGridWeek" 
                  ? "bg-blue-500 text-white" 
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              WEEK
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1">
        <FullCalendarAny
          ref={calendarRef}
          {...calendarOptions}
          view={currentView}
          onViewChange={(view: any) => setCurrentView(view.view.type)}
        />
      </div>

      {/* Create Event Modal */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Reservation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Reservation title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Description of the reservation..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>Time:</span>
                  <span>
                    {selectedDates?.start.toLocaleString("en-GB")} - {selectedDates?.end.toLocaleString("en-GB")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Reservation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Reservation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Reservation title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Description of the reservation..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>Time:</span>
                  <span>
                    {selectedEvent?.start.toLocaleString("en-GB")} - {selectedEvent?.end.toLocaleString("en-GB")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setIsDeleteDialogOpen(true);
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                Delete
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateEvent}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Reservation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this reservation? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {isLoading ? "Deleting..." : "Delete Reservation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernCalendar;
