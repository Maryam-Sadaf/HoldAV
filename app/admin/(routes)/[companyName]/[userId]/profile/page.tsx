import React from "react";
import EmptyState from "@/components/EmptyState";

interface IParams {
  companyName: string;
  userId: string;
}

const Profil = async ({ params }: { params: Promise<IParams> }) => {
  const { companyName, userId } = await params;
  
  return (
    <EmptyState
      title="404 Not Found"
      subTitle="Sorry, the page you're looking for does not exist."
    />
  );
};

export default Profil;
