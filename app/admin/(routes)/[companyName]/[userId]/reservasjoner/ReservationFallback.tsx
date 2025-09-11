import Card from "@/components/Card";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import Updates from "@/components/Updates";
import Width from "@/components/Width";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ReservationFallback = () => {
  return (
    <Container>
      <div className="sm:px-10 md:px-10 lg:px-0 xl:px-0 2xl:px-0">
        <div className="relative w-full">
          <Width>
            <div className="grid grid-cols-1 my-3 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 ">
              <div>
                <Skeleton className="my-5 bg-gray-200 h-[400px] w-[200px]" />
              </div>
              <div>
                <Skeleton className="my-5 bg-gray-200 h-[400px] w-[200px]" />
              </div>{" "}
              <div>
                <Skeleton className="my-5 bg-gray-200 h-[400px] w-[200px]" />
              </div>
            </div>
          </Width>
        </div>
      </div>
    </Container>
  );
};

export default ReservationFallback;
