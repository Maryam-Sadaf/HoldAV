import EmptyState from "@/components/EmptyState";
import React from "react";

const InvalidToken = () => {
  return (
    <EmptyState
      title="Invalid Token"
      subTitle="Invalid Token, please try again"
    />
  );
};

export default InvalidToken;
