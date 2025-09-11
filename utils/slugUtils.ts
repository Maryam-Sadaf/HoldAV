/**
 * Utility functions for consistent slug handling
 */

/**
 * Converts a room name to a normalized URL slug (always lowercase)
 * Example: "Meeting Room B" -> "meeting-room-b"
 */
export const roomNameToSlug = (roomName: string): string => {
  return roomName
    .replace(/\s+/g, "-")
    .toLowerCase();
};

/**
 * Converts a URL slug back to a room name format
 * Tries multiple variations to handle different room name formats
 * Example: "meeting-room-b" -> "Meeting Room B"
 */
export const slugToRoomName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Normalizes company name to slug format (consistent with existing logic)
 */
export const companyNameToSlug = (companyName: string): string => {
  return companyName.replace(/\s+/g, "-");
};

/**
 * Converts company slug back to proper format
 */
export const slugToCompanyName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.toUpperCase() === 'AS' ? 'AS' : word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats room name for display with proper capitalization
 * Ensures first letter is always capital, handles both regular names and slug-like names
 * Examples: 
 * - "meeting-room-2" -> "Meeting-room-2"
 * - "Maryam" -> "Maryam" (unchanged)
 * - "meeting room b" -> "Meeting room b"
 */
export const formatRoomNameForDisplay = (roomName: string): string => {
  if (!roomName) return "";
  
  // Simply capitalize the first letter, keep the rest as is
  return roomName.charAt(0).toUpperCase() + roomName.slice(1);
};

/**
 * Formats room name for storage in database with proper title case
 * Capitalizes the first letter of each word
 * Examples:
 * - "meeting room" -> "Meeting Room"
 * - "MEETING ROOM" -> "Meeting Room" 
 * - "meeting Room B" -> "Meeting Room B"
 * - "maryam" -> "Maryam"
 */
export const formatRoomNameForStorage = (roomName: string): string => {
  if (!roomName) return "";
  
  return roomName
    .toLowerCase() // Convert to lowercase first
    .split(' ') // Split by spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(' '); // Join back with spaces
};
