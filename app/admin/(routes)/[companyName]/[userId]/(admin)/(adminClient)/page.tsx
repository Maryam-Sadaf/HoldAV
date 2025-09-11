import React, { Suspense } from "react";
import Admin from "./Admin";
import AdminFallback from "./AdminFallback";

interface IParams {
  userId?: string;
  companyName?: string;
}

const page = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<AdminFallback />}>
      <Admin params={resolvedParams as any} />
    </Suspense>
  );
};

export default page;
