import Container from "@/components/Container";
import Width from "@/components/Width";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const RoomsFallback = () => {
  return (
    <Container>
      <div className="sm:px-10 md:px-10 lg:px-0 xl:px-0 2xl:px-0">
        <div className="relative w-full">
          <div className="relative w-full">
            <Skeleton className="my-5 bg-gray-200 h-4 w-[250px]" />
            <Skeleton className="my-5 bg-gray-200 h-4 w-[350px]" />

            <Skeleton className="mt-12 mb-6 bg-gray-200 h-8 w-[650px]" />
            <Skeleton className="my-6 bg-gray-200 h-8 w-[650px]" />
            <Skeleton className="my-6 bg-gray-200 h-8 w-[650px]" />
            <Skeleton className="my-6 bg-gray-200 h-8 w-[650px]" />
          </div>{" "}
        </div>
      </div>
    </Container>
  );
};

export default RoomsFallback;
