"use client";
import EmptyState from "@/components/EmptyState";
import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error("Rooms error:", error);
  }, [error]);

  return (
    <EmptyState 
      title="Noe gikk galt" 
      subTitle="Det oppstod en feil ved lasting av møterom" 
    />
  );
};

export default Error;