/**
 * Formats a time duration from start and end dates into a human-readable string
 * Example: 06:00 - 07:30 → "1 hour 30 minutes"
 */
export const formatDuration = (startDate: Date | string, endDate: Date | string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = Math.floor(durationMs / (1000 * 60));
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
};

/**
 * Formats time range as HH:MM - HH:MM
 */
export const formatTimeRange = (startDate: Date | string, endDate: Date | string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startTime = start.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
  const endTime = end.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
  
  return `${startTime} - ${endTime}`;
};
