import React from "react";

interface AddToGoogleCalendarButtonProps {
  eventTitle: any;
  startDate: any;
  endDate: any;
  eventDetails: any;
  location: any;
  userEmail: any;
}

const AddToGoogleCalendarButton = ({
  eventTitle,
  startDate,
  endDate,
  eventDetails,
  location,
  userEmail,
}: AddToGoogleCalendarButtonProps) => {
  const googleCalendarLink = `https://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&dates=${encodeURIComponent(startDate)}/${encodeURIComponent(
    endDate
  )}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(
    location
  )}&add=${encodeURIComponent(userEmail)}`;

  return (
    <a
      href={googleCalendarLink}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-1 text-sm rounded-md hover:bg-light/75 hover:text-gray-600 bg-light"
    >
      Legg til i Kalender
    </a>
  );
};

export default AddToGoogleCalendarButton;
