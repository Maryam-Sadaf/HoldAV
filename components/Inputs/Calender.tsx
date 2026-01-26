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
  // Convert ISO dates to Google Calendar format
  const formatDateForGoogle = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Format: YYYYMMDDTHHMMSSZ
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    } catch (error) {
      return '';
    }
  };

  const formattedStartDate = formatDateForGoogle(startDate);
  const formattedEndDate = formatDateForGoogle(endDate);

  const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
    eventTitle
  )}&dates=${formattedStartDate}/${formattedEndDate}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(
    location
  )}&add=${encodeURIComponent(userEmail)}`;

  return (
    <a
      href={googleCalendarLink}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-1 text-sm rounded-lg bg-primary hover:opacity-80 text-white text-center transition w-full inline-block"
    >
      Legg til i Kalender
    </a>
  );
};

export default AddToGoogleCalendarButton;
