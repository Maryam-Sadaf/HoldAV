import { Suspense } from "react";
import Reservations from "./Reservations";
import ReservationFallback from "./ReservationFallback";

interface IParams {
  companyName?: string;
  userId?: string;
}

const ReservationPage = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<ReservationFallback />}>
      {/* Pass route params so companyName is available downstream */}
      <Reservations params={resolvedParams as any} />
    </Suspense>
  );
};

export default ReservationPage;
