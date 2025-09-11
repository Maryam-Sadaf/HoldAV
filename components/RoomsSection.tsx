import RoomButton from "./RoomButton";
import LoadingSpinner from "./LoadingSpinner";
import { roomNameToSlug, companyNameToSlug } from "@/utils/slugUtils";

interface RoomsSectionProps {
  rooms: any[] | null | undefined;
  routes: any;
  isLoading?: boolean;
}

const RoomsSection = ({ rooms, routes, isLoading = false }: RoomsSectionProps) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex w-full">
        <div className="flex items-center justify-center w-full py-10">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  // No rooms available
  if (!rooms || rooms.length === 0) {
    return (
      <div className="flex w-full border-t border-b border-primary">
        <div className="flex items-center justify-center w-full py-8">
          <span className="text-sm text-gray-500">No meeting rooms available</span>
        </div>
      </div>
    );
  }

  // Rooms available - render them
  return (
    <div className="flex w-full border-t border-b border-primary">
      <div className="flex flex-row flex-wrap items-center justify-center w-full px-8 py-6 gap-x-12 gap-y-4">
        {rooms.map((room) => (
          <RoomButton
            key={room?.id}
            room={room}
            href={`/${companyNameToSlug(
              routes?.creator?.firmanavn || routes?.company?.firmanavn || ""
            )}/${roomNameToSlug(room?.name || "")}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomsSection;
