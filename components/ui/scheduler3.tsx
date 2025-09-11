import React, { useCallback, useEffect, useRef, useState } from "react";
import "dhtmlx-scheduler";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css";
import "dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_limit.js";
import { safeUser } from "@/types";

interface Dates {
  id: string;
  start_date: string;
  end_date: string;
  text: string;
}

interface SchedulerProps {
  timeFormatState: boolean;
  onDataUpdated?: (action: string, event: any, id: string) => void;
  dates: Dates[];
  onSubmit: () => void;
  onUpdateReservation: (id: string, isUpdate: any) => void;
  onCancelReservation: (id: string) => void;
  setIsReservation: any;
  onDateSelect: (startDate: string, endDate: string, eventName: string) => void;
  currentUser?: safeUser | null;
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
}: SchedulerProps) => {
  const schedulerContainerRef = useRef(null);
  const [event, setEvent] = useState<Dates[]>([]);
  useEffect(() => {
    setEvent(dates);
  }, [dates]);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const initialViewMode = screenWidth > 600 ? "week" : "day";

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
      scheduler.config.hour_date = timeFormatState ? "%H:%i" : "%g:%i %A";
      scheduler.config.details_on_dblclick = true;
      scheduler.config.details_on_create = true;
      scheduler.locale.labels.timeline_tab = "Timeline";
      scheduler.xy.scale_width = 70;
      scheduler.locale.labels.section_text = "Text";
      scheduler.locale.labels.new_event = "Reservasjon";
      scheduler.config.background = "#FF0000";
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

      scheduler.setLoadMode("week");

      scheduler.config.lightbox.sections = [
        {
          name: "Beskrivelse",
          height: 40,
          //width: 40,
          type: "textarea",
          focus: true,
          default_value:
            `${currentUser?.firstname} ${currentUser?.lastname}` ||
            currentUser?.email ||
            "",
          value: 1,
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

      scheduler.config.details_on_dblclick = true;
      scheduler.config.details_on_create = true;
      scheduler.locale.labels["calender_button"] = "";
      scheduler.config.icons_select = [];

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
        const eventName =
          `${currentUser?.firstname} ${currentUser?.lastname}` || "Reservasjon";
        onDateSelect(startDate, endDate, eventName);

        if (onDataUpdated) {
          onDataUpdated("create", ev, id);
          onSubmit();
        }
      });
      scheduler.attachEvent("onBeforeLightbox", function (id: any) {
        const event = scheduler.getEvent(id);
        if (event && event.userId && currentUser?.id !== event.userId) {
          return false;
        }
        return true;
      });
      scheduler.attachEvent("onEventChanged", function (id: any, ev: any) {
        if (onDataUpdated) {
          onDataUpdated("update", ev, id);
          onUpdateReservation(id, {
            start_date: ev.start_date,
            end_date: ev.end_date,
            text: ev.text,
          });
        }
      });

      scheduler.attachEvent("onEventDeleted", function (id: any, ev: any) {
        if (scheduler.getState().new_event) {
          return;
        }
        if (currentUser?.id === ev.userId) {
          if (onDataUpdated) {
            onDataUpdated("delete", ev, id);
            onCancelReservation(id);
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
  ]);

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
        style={{ width: "100%", height: "100%" }}
        className=""
      ></div>
    </>
  );
};

export default Scheduler;
