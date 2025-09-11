"use client";
import EmptyState from "@/components/EmptyState";
import { useEffect } from "react";

interface ErrorProps {
  error: Error;
}
const Error = ({ error }: ErrorProps) => {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return <EmptyState title="Uh Oh" subTitle="Something went wrong!" />;
};

export default Error;
