/**
 * Utility functions for consistent slug handling
 */

/**
 * Converts a room name to a normalized URL slug (always lowercase)
 * Example: "Meeting Room B" -> "meeting-room-b"
 * Sanitizes special characters to prevent URL breaking
 */
export const roomNameToSlug = (roomName: string): string => {
  return roomName
    .trim()
    // Remove or replace dangerous characters
    .replace(/[<>"'&\/\\]/g, '') // Remove dangerous chars
    .replace(/[^a-zA-Z0-9\s-]/g, '-') // Replace other special chars with hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
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
 * Sanitizes special characters to prevent URL breaking
 */
export const companyNameToSlug = (companyName: string): string => {
  return companyName
    .trim()
    // Remove or replace dangerous characters
    .replace(/[<>"'&\/\\]/g, '') // Remove dangerous chars
    .replace(/[^a-zA-Z0-9\s-]/g, '-') // Replace other special chars with hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .toLowerCase();
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
 * - "meeting-room-2" -> "Meeting Room 2"
 * - "Maryam" -> "Maryam" (unchanged)
 * - "meeting room b" -> "Meeting Room B"
 */
export const formatRoomNameForDisplay = (roomName: string): string => {
  if (!roomName) return "";
  
  // If it looks like a slug (contains hyphens), convert it back to proper format
  if (roomName.includes('-')) {
    return slugToRoomName(roomName);
  }
  
  // Otherwise, just ensure proper title case
  return roomName
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Sanitizes and validates room name input
 * Removes dangerous characters and validates format
 */
export const sanitizeRoomName = (roomName: string): string => {
  if (!roomName) return "";
  
  return roomName
    .trim()
    // Remove dangerous characters that could break URLs or cause security issues
    .replace(/[<>"'&\/\\]/g, '')
    // Replace other problematic characters with spaces
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    // Normalize multiple spaces to single space
    .replace(/\s+/g, ' ')
    .trim();
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
  
  const sanitized = sanitizeRoomName(roomName);
  
  return sanitized
    .toLowerCase() // Convert to lowercase first
    .split(' ') // Split by spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(' '); // Join back with spaces
};
