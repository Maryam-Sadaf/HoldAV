import React, { useCallback, useEffect, useRef, useState } from "react";
import "dhtmlx-scheduler";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css";
import "dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_limit.js";
// import 'dhtmlx-scheduler/codebase/dhtmlxscheduler.css';
// import "dhtmlx-scheduler/codebase/dhtmlxscheduler";
// import "dhtmlx-scheduler/codebase/dhtmlxscheduler.css";
import { safeUser } from "@/types";
import { toast } from "react-hot-toast";
//import "@/app/ScheduleStyle.css";
//import "dhtmlx-scheduler/codebase/locale/locale_no.js";

interface Dates {
  id: string;
  start_date: Date;
  end_date: Date;
  text: string;
  css?: string;
}

interface SchedulerProps {
  timeFormatState: boolean;
  onDataUpdated?: (action: string, event: any, id: string) => void;
  dates: Dates[];
  onSubmit: (
    data: { start_date: Date; end_date: Date; text: string }
  ) => Promise<{ id?: string } | void> | { id?: string } | void;
  onUpdateReservation: (id: string, isUpdate: any) => void;
  onCancelReservation: (id: string) => void;
  setIsReservation: any;
  onDateSelect: (startDate: string, endDate: string, eventName: string) => void;
  currentUser?: safeUser | null;
  isLoading?: boolean;
}

const scheduler =
  typeof window !== "undefined"
    ? (window as any).scheduler
    : console.log("Window undefined");

const Scheduler = ({
  timeFormatState,
  onDataUpdated,
  setIsReservation,
  onSubmit,
  onUpdateReservation,
  currentUser,
  dates,
  onDateSelect,
  onCancelReservation,
  isLoading = false,
}: SchedulerProps) => {
  const schedulerContainerRef = useRef(null);
  const [event, setEvent] = useState<Dates[]>([]);
  const [buttonStates, setButtonStates] = useState<{
    save: 'idle' | 'loading' | 'success' | 'error';
    cancel: 'idle' | 'loading' | 'success' | 'error';
  }>({
    save: 'idle',
    cancel: 'idle'
  });
  // Keep track of last known event state to support reverting after failed updates/validation
  const lastEventStateRef = useRef<Record<string, { start: Date; end: Date }>>({});
  useEffect(() => {
    setEvent(dates);
  }, [dates]);

  // Helper function to update button UI with optimistic feedback
  const updateButtonUI = useCallback((buttonType: 'save' | 'cancel', state: 'idle' | 'loading' | 'success' | 'error') => {
    const buttonSelectors = buttonType === 'save' 
      ? ['[data-section-name="dhx_save_btn"]', '.dhx_save_btn']
      : ['[data-section-name="dhx_cancel_btn"]', '.dhx_cancel_btn'];
    
    const buttons = document.querySelectorAll(buttonSelectors.join(', '));
    
    buttons.forEach(button => {
      if (button instanceof HTMLElement) {
        const htmlButton = button as HTMLButtonElement;
        
        switch (state) {
          case 'loading':
            button.classList.add('loading');
            htmlButton.disabled = true;
            if (buttonType === 'save') {
              button.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                  <div style="width: 16px; height: 16px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                  <span>LAGRER...</span>
                </div>
              `;
            } else {
              button.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                  <div style="width: 16px; height: 16px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                  <span>AVBRYTER...</span>
                </div>
              `;
            }
            break;
            
          case 'success':
            button.classList.remove('loading');
            button.classList.add('success');
            htmlButton.disabled = false;
            if (buttonType === 'save') {
              button.innerHTML = 'LAGRET ✓';
            } else {
              button.innerHTML = 'AVBRUTT ✓';
            }
            // Reset to normal state after 1 second
            setTimeout(() => {
              button.classList.remove('success');
              if (buttonType === 'save') {
                button.innerHTML = 'LAGRE';
              } else {
                button.innerHTML = 'AVBRYT';
              }
            }, 1000);
            break;
            
          case 'error':
            button.classList.remove('loading');
            button.classList.add('error');
            htmlButton.disabled = false;
            if (buttonType === 'save') {
              button.innerHTML = 'FEIL - PRØV IGJEN';
            } else {
              button.innerHTML = 'FEIL - PRØV IGJEN';
            }
            // Reset to normal state after 2 seconds
            setTimeout(() => {
              button.classList.remove('error');
              if (buttonType === 'save') {
                button.innerHTML = 'LAGRE';
              } else {
                button.innerHTML = 'AVBRYT';
              }
            }, 2000);
            break;
            
          case 'idle':
          default:
            button.classList.remove('loading', 'success', 'error');
            htmlButton.disabled = false;
            if (buttonType === 'save') {
              button.innerHTML = 'LAGRE';
            } else {
              button.innerHTML = 'AVBRYT';
            }
            break;
        }
      }
    });
  }, []);

  // Helper function to show single toast message
  const showToast = useCallback((action: 'save' | 'cancel', type: 'success' | 'error', operation?: 'create' | 'update') => {
    switch (type) {
      case 'success':
        if (action === 'save') {
          if (operation === 'update') {
            toast.success('Reservasjon oppdatert!');
          } else {
            toast.success('Reservasjon lagret!');
          }
        } else {
          toast.success('Reservasjon avbrutt!');
        }
        break;
      case 'error':
        if (action === 'save') {
          if (operation === 'update') {
            toast.error('Dette tidsrommet er allerede reservert');
          } else {
            toast.error('Kunne ikke lagre reservasjon');
          }
        } else {
          toast.error('Kunne ikke avbryte reservasjon');
        }
        break;
    }
  }, []);

  // Effect to handle loading state on buttons - optimized for responsiveness
  useEffect(() => {
    // Update button states based on current state
    if (buttonStates.save !== 'idle') {
      updateButtonUI('save', buttonStates.save);
    }
    if (buttonStates.cancel !== 'idle') {
      updateButtonUI('cancel', buttonStates.cancel);
    }
  }, [isLoading, buttonStates, updateButtonUI]);

  useEffect(() => {
    const updatedEvents = dates.map((date) => ({
      ...date,
      css: date.start_date < new Date() ? "gray_event" : "red_event",
    }));
    setEvent(updatedEvents);
  }, [dates]);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const initialViewMode = screenWidth > 600 ? "week" : "day";

    /*
         if (scheduler && !scheduler._$initialized) {
      // Initialize the scheduler if it exists and hasn't been initialized yet
      scheduler.init(
        schedulerContainerRef.current,
        new Date(),
        initialViewMode
      );
      scheduler.parse(event, "json");
    }
  }, [event, scheduler]);
*/

    scheduler.init("scheduler_here", new Date(), initialViewMode);

    scheduler.parse(event, "json");
  }, [event]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (scheduler._$initialized) {
      return console.log("scheduler initialized");
    }
    try {
      scheduler.skin = "material";
      console.log("Scheduler Configs");
      //scheduler.config.header = ["week", "dato", "today", "prev", "next"];
      scheduler.config.hour_date = timeFormatState ? "%H:%i" : "%g:%i %A";

      scheduler.config.details_on_dblclick = true;
      scheduler.config.details_on_create = true;
      scheduler.locale.labels.timeline_tab = "Timeline";
      // scheduler.locale.labels.section_custom = "Section";
      scheduler.xy.scale_width = 70;
      scheduler.locale.labels.section_text = "Text";
      scheduler.locale.labels.new_event = "Reservasjon";
      scheduler.config.background = "#FF0000";
      //scheduler.config.hour_scale = "40";
      scheduler.config.hour_size_px = "40"; // Better hour height for scrollable view
      scheduler.config.first_hour = "00";
      scheduler.config.last_hour = "24";
      scheduler.config.scroll_hour = 8; // Start scroll at 8 AM (business hours)
      scheduler.config.fit_events = true; // Auto-fit events
      scheduler.config.time_step = 15; // 15-minute intervals
      scheduler.config.min_event_height = 20; // Minimum event height
      scheduler.config.full_day = false; // Disable full-day events to save space
      
      // Hide only the day column header date (below main header) in day view
      scheduler.templates.day_scale_date = function() {
        return "";
      };
      
      //scheduler.background.primary = "#FF0000";
      //scheduler.locale.labels.save = "lagre";
      scheduler.config.header = [
        "prev",
        "today",
        "next",
        "spacer",
        "date",
        "spacer",
        "day",
        "week",
      ];
      /*
      scheduler.config.header = [
        "day",
        "week",
        "spacer",
        "date",
        "spacer",
        "prev",
        "today",
        "next",
      ];
      */
      //scheduler.config.header = {
      //  rows: [
      //    {
      //      cols: ["spacer", "prev", "date", "next"],
      //    },
      //    {
      //      cols: ["day", "week", "month", "spacer", "today"],
      //    },
      //  ],
      //};
      //scheduler.setLoadMode("week");

      scheduler.config.lightbox.sections = [
        {
          name: "Opprettet av",
          height: 40,
          type: "textarea",
          focus: false,
          default_value:
            `${currentUser?.firstname} ${currentUser?.lastname}` ||
            currentUser?.email ||
            "",
          map_to: "text",
          disabled: true,
        },
        {
          name: "Tid",
          height: 100,
          type: "time",
          map_to: "auto",
          time_format: ["%H:%i", "%d", "%m", "%Y"],
        },
      ];

      scheduler.templates.event_class = function (
        start: any,
        end: any,
        event: any
      ) {
        return event.css || "";
      };
      scheduler.templates.event_class = function (
        start: any,
        end: any,
        event: any
      ) {
        if (event.type == "manager") return "manager_event";
        return "employee_event";
      };
      scheduler.updateView();
      scheduler.attachEvent(
        "onBeforeEventChanged",
        function (ev: any, e: any, is_new: any, original: any) {
          // Preserve previous times so we can revert if validation/API fails
          if (original) {
            try {
              lastEventStateRef.current[String(ev.id)] = {
                start: new Date(original.start_date),
                end: new Date(original.end_date),
              };
            } catch (_) {}
          }

          if (original && original.css === "red_event") {
            ev.css = "red_event";
          }

          return true;
        }
      );

      /*time_format: [
        {
          cols: ["%H:%i"],
        },
        {
          cols: ["%d", "%m", "%Y"],
        },
      ],*/

      scheduler.config.details_on_dblclick = true;
      scheduler.config.details_on_create = true;
      scheduler.locale.labels["calender_button"] = "";
      scheduler.config.icons_select = [];
      scheduler.config.time_step = "15";
      scheduler.locale.labels.day_tab = "dag";
      scheduler.locale.labels.week_tab = "uke";
      scheduler.locale.labels.icon_save = "lagre";
      scheduler.locale.labels.icon_cancel = "avbryt";
      scheduler.locale.labels.icon_delete = "slett";
      scheduler.locale.labels.confirm_deleting =
        "Er du sikker på at du ønsker permanent slette denne reservasjonen?";
      scheduler.locale.labels.message_cancel = "avbryt";
      scheduler.locale.labels.dhx_cal_today_button = "I DAG";
      scheduler.locale.date.month_full = [
        "Januar",
        "Februar",
        "Mars",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      scheduler.locale.date.month_short = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      scheduler.locale.date.day_full = [
        "Søndag",
        "Mandag",
        "Tirsdag",
        "Onsdag",
        "Torsdag",
        "Fredag",
        "Lørdag",
      ];
      scheduler.locale.date.day_short = [
        "Søn",
        "Man",
        "Tir",
        "Ons",
        "Tor",
        "Fre",
        "Lør",
      ];
      scheduler.config.buttons_left = [
        "dhx_save_btn",
        "dhx_cancel_btn",
        "calender_button",
      ];
      
      // Clear default buttons on the right to prevent duplicates
      scheduler.config.buttons_right = [];

      //COLORS
      //scheduler.base.colors.primary = "#FF00000";

      scheduler.attachEvent(
        "onLightboxButton",
        function (button_id: any, node: any, e: any, ev: any) {
          if (button_id === "calender_button") {
            const startDate = ev?.start_date;
            const eventTitle = ev?.text || "Reservasjonstittel";
            const endDate = ev?.end_date;
            const eventDetails = currentUser?.email || "Reservert";

            const googleCalendarLink = `https://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(
              eventTitle
            )}&dates=${encodeURIComponent(startDate)}/${encodeURIComponent(
              endDate
            )}&details=${encodeURIComponent(eventDetails)}`;

            window.open(googleCalendarLink, "_blank");
          }
          
          // Handle save button - immediate spinner feedback
          if (button_id === "dhx_save_btn") {
            // Immediately show spinner feedback
            setButtonStates(prev => ({ ...prev, save: 'loading' }));
            
            // Force immediate UI update
            requestAnimationFrame(() => {
              scheduler.render();
            });
            
            return true; // Allow default save behavior
          }
          
          // Handle cancel button - immediate spinner feedback
          if (button_id === "dhx_cancel_btn") {
            // Immediately show spinner feedback
            setButtonStates(prev => ({ ...prev, cancel: 'loading' }));
            
            // Hide lightbox immediately for better UX
            scheduler.hideLightbox();
            
            return false; // Prevent default behavior since we're handling it
          }
        }
      );

      scheduler.locale.labels.section_text = "Text";
      let markedTimespan: any;
      scheduler.attachEvent(
        "onBeforeViewChange",
        function (old_mode: any, old_date: any, mode: any, date: any) {
          var viewStartDate = scheduler.date[mode + "_start"](new Date(date));
          if (mode == "month")
            viewStartDate = scheduler.date.week_start(viewStartDate);
          if (markedTimespan) {
            scheduler.deleteMarkedTimespan(markedTimespan);
          }
          markedTimespan = scheduler.addMarkedTimespan({
            start_date: viewStartDate,
            end_date: new Date(),
            zones: "fullday",
            type: "dhx_time_block",
          });
          return true;
        }
      );

      scheduler.templates.month_date_class = function (date: any) {
        if (date < new Date()) {
          return "gray_section";
        } else {
          return "";
        }
      };
      scheduler.attachEvent(
        "onBeforeDrag",
        function (id: any, mode: any, e: any) {
          const event = scheduler.getEvent(id);
          if (event && event.userId && currentUser?.id !== event.userId) {
            return false;
          }
          return true;
        }
      );

      scheduler.attachEvent("onEventAdded", (id: any, ev: any) => {
        setIsReservation(true);
        const startDate = ev.start_date;
        const endDate = ev.end_date;
        // Use current event text so the lightbox shows and submits what the user sees
        const eventText = (ev && ev.text && String(ev.text).trim().length > 0)
          ? ev.text
          : ((`${currentUser?.firstname} ${currentUser?.lastname}` || currentUser?.email || ""));
        onDateSelect(startDate, endDate, eventText);

        if (onDataUpdated) {
          onDataUpdated("create", ev, id);
          
          // Require non-empty created-by text before saving
          if (!eventText || String(eventText).trim().length === 0) {
            try { scheduler.deleteEvent(id); } catch (_) {}
            setButtonStates(prev => ({ ...prev, save: 'error' }));
            toast.error('Created by is required');
            return;
          }

          // Client-side overlap guard against existing events
          try {
            const newStart = new Date(ev.start_date).getTime();
            const newEnd = new Date(ev.end_date).getTime();
            const conflict = (event || []).some((existing) => {
              // Ignore the event being created (no matching id in our props yet)
              const existingStart = new Date(existing.start_date).getTime();
              const existingEnd = new Date(existing.end_date).getTime();
              return existingStart < newEnd && existingEnd > newStart;
            });

            if (conflict) {
              scheduler.deleteEvent(id);
              setButtonStates(prev => ({ ...prev, save: 'error' }));
              toast.error('Dette tidsrommet er allerede reservert.');
              // Do not call onSubmit, just stop here
              return;
            }
          } catch (_) {}

          // Call onSubmit and handle result
          const handleSaveResult = async () => {
            try {
              const result = await onSubmit({ start_date: startDate, end_date: endDate, text: eventText });
              // If backend returned a real reservation id, swap the temp id
              const createdId = (result as any)?.id;
              if (createdId) {
                try { scheduler.changeEventId(id, createdId); } catch (_) {}
              }
              // Show success feedback
              setButtonStates(prev => ({ ...prev, save: 'success' }));
              showToast('save', 'success');
              
              // Note: The actual database ID will be available after the page refreshes
              // The scheduler will get the correct ID from the dates prop
            } catch (error) {
              // Revert the newly added event on failure
              try {
                scheduler.deleteEvent(id);
              } catch (_) {}
              // Show conflict-specific message if available
              const isConflict = (error as any)?.response?.status === 409;
              setButtonStates(prev => ({ ...prev, save: 'error' }));
              if (isConflict) {
                toast.error('Dette tidsrommet er allerede reservert.');
              } else {
                const msg = (error as any)?.message;
                if (msg) {
                  toast.error(String(msg));
                } else {
                  showToast('save', 'error');
                }
              }
            } finally {
              // Reset button state after feedback
              setTimeout(() => {
                setButtonStates(prev => ({ ...prev, save: 'idle' }));
              }, 2000);
            }
          };
          
          handleSaveResult();
          
          // Immediate render for better responsiveness
          scheduler.render();
        }
      });
      scheduler.attachEvent("onBeforeLightbox", function (id: any) {
        const ev = scheduler.getEvent(id);
        if (ev && ev.userId && currentUser?.id !== ev.userId) {
          return false;
        }
        // Ensure Created by shows the event's text; fallback to current user
        const fallbackText = `${currentUser?.firstname} ${currentUser?.lastname}` || currentUser?.email || "";
        if (!ev.text || ev.text === scheduler.locale.labels.new_event || ev.text === "Reservasjon") {
          ev.text = fallbackText;
          try { scheduler.updateEvent(id); } catch (_) {}
        }
        return true;
      });
      scheduler.attachEvent("onEventChanged", function (id: any, ev: any) {
        if (!onDataUpdated) return;

        // Overlap validation (same room page contains all events for the room)
        const hasOverlap = () => {
          try {
            const minDate = new Date(0);
            const maxDate = new Date(8640000000000000);
            const events = scheduler.getEvents(minDate, maxDate) || [];
            return events.some((other: any) => {
              if (!other || String(other.id) === String(id)) return false;
              return ev.start_date < other.end_date && ev.end_date > other.start_date;
            });
          } catch (_) {
            return false;
          }
        };

        if (hasOverlap()) {
          // Revert to previous time and notify
          const prev = lastEventStateRef.current[String(id)];
          if (prev) {
            ev.start_date = new Date(prev.start);
            ev.end_date = new Date(prev.end);
            try { scheduler.updateEvent(id); } catch (_) {}
            try { scheduler.render(); } catch (_) {}
          }
          // Use existing error toast channel with update action
          showToast('save', 'error', 'update');
          return;
        }

        onDataUpdated("update", ev, id);

        // Optimistic UI already applied by dhtmlx; call API, revert on failure
        const handleUpdateResult = async () => {
          try {
            await onUpdateReservation(id, {
              start_date: ev.start_date,
              end_date: ev.end_date,
              text: ev.text,
            });
            setButtonStates((prev) => ({ ...prev, save: 'success' }));
            showToast('save', 'success', 'update');
          } catch (error) {
            // Revert on failure
            const prev = lastEventStateRef.current[String(id)];
            if (prev) {
              ev.start_date = new Date(prev.start);
              ev.end_date = new Date(prev.end);
              try { scheduler.updateEvent(id); } catch (_) {}
              try { scheduler.render(); } catch (_) {}
            }
            setButtonStates((prev) => ({ ...prev, save: 'error' }));
            showToast('save', 'error', 'update');
          } finally {
            setTimeout(() => {
              setButtonStates((prev) => ({ ...prev, save: 'idle' }));
            }, 2000);
          }
        };

        handleUpdateResult();
        try { scheduler.render(); } catch (_) {}
      });

      scheduler.attachEvent("onEventDeleted", function (id: any, ev: any) {
        if (scheduler.getState().new_event) {
          return;
        }
        if (currentUser?.id === ev.userId) {
          //console.log("🚀 ~ currentUser?.id:", currentUser?.id);
          //console.log("🚀 ~ ev.userId:", ev.userId);
          if (onDataUpdated) {
            onDataUpdated("delete", ev, id);
            
            // Handle cancel with result feedback
            const handleCancelResult = async () => {
              try {
                await onCancelReservation(id);
                // Show success feedback
                setButtonStates(prev => ({ ...prev, cancel: 'success' }));
                showToast('cancel', 'success');
              } catch (error) {
                // Show error feedback
                setButtonStates(prev => ({ ...prev, cancel: 'error' }));
                showToast('cancel', 'error');
              } finally {
                // Reset button state after feedback
                setTimeout(() => {
                  setButtonStates(prev => ({ ...prev, cancel: 'idle' }));
                }, 2000);
              }
            };
            
            handleCancelResult();
            
            // Immediate render for better responsiveness
            scheduler.render();
          }
        } else {
          ev.readonly = true;
          scheduler.updateEvent(id);
        }
      });
      scheduler.attachEvent(
        "onAfterUpdate",
        function (id: any, action: any, data: any) {
          if (action === "delete") {
            scheduler.config.details_on_dblclick = true;
            scheduler.config.details_on_create = true;
          }
          // scheduler.attachEvent("onBeforeLightbox", function (id: any) {
          //   // const event = scheduler.getEvent(id);

          //   // Check if the current user is allowed to edit the event
          //   // if (event && event.userId && currentUser?.id !== event.userId) {
          //   //   return false;
          //   // }

          //   // return true;
          // });
        }
      );

      scheduler._$initialized = true;
    } catch (error) {
      console.log(error);
    }

    return () => {};
  }, [
    timeFormatState,
    setIsReservation,
    currentUser?.email,
    currentUser?.firstname,
    currentUser?.lastname,
    currentUser?.id,
    onCancelReservation,
    onUpdateReservation,
    onDataUpdated,
    onDateSelect,
    onSubmit,
    setButtonStates,
    showToast,
  ]);

  //}, []);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    scheduler.render();
  }, [timeFormatState]);

  const setHoursScaleFormat = (state: any) => {
    scheduler.config.hour_date = state ? "%H:%i" : "%g:%i %A";
    scheduler.templates.hour_scale = scheduler.date.date_to_str(
      scheduler.config.hour_date
    );
  };

  setHoursScaleFormat(timeFormatState);

      return (
    <>
      <div
        ref={schedulerContainerRef}
        id="scheduler_here"
        style={{ 
          width: "100%", 
          height: "100vh", // Use viewport height for scrollable container
          // minHeight: "600px",
          // maxHeight: "calc(100vh - 150px)", // Prevent taking full screen
          overflow: "auto", // Enable scrolling
          border: "1px solid #e5e7eb", // Add subtle border
          borderRadius: "8px" // Rounded corners
        }}
        className=""
      ></div>
    </>
  );
};

export default Scheduler;

// if (currentUser?.id === ev.userId) {
// } else {
//   ev.readonly = true;
//   scheduler.updateEvent(id);
// }
// scheduler.attachEvent("onBeforeLightbox", function (id: any) {
//   // const event = scheduler.getEvent(id);

//   // Check if the current user is allowed to edit the event
//   // if (event && event.userId && currentUser?.id !== event.userId) {
//   //   return false;
//   // }
//   scheduler.formSection("text").control.value = currentUser?.email || "";

//   // return true;
// });
