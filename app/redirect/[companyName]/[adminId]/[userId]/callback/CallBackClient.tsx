"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSearchParams } from "next/navigation";
//import { safeUser } from "@/types";
import { toast } from "react-hot-toast";
import EmptyState from "@/components/EmptyState";
interface CallBackClientProps {
  currentUser: any | null;
}

const CallBackClient = ({ currentUser }: CallBackClientProps) => {
  const router = useRouter();
  const companyNameParams = useParams<{ companyName: string; item: string }>();
  const params = useParams<{ userId: string; item: string }>();
  const userId = params ? params.userId : null;
  const companyName = companyNameParams ? companyNameParams.companyName : null;
  const adminParams = useParams<{ adminId: string; item: string }>();
  const adminId = adminParams ? adminParams.adminId : null;

  const searchParams = useSearchParams();
  const access_token = searchParams?.get("token");
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    setToken(access_token!);
  }, [access_token]);
  useEffect(() => {
    if (access_token || companyName) {
      axios
        .post("/api/invite/user-join", { token, companyName, userId, adminId })
        .then((response) => {
          console.log(response.data);
          router.push(
            `/admin/${companyName?.replace(/\s+/g, "-")}/${adminId}/rooms`
          );
          toast.success("Ble med!");
        })
        .catch((error) => {
          console.error("Error handling invitation:", error);
          if (error.response.status === 400) {
            toast.error("Ugyldig Token");
            router.push("/invalid-token");
          }
        });
    } else {
      console.error("Mangler token");
    }
  }, [access_token, companyName, userId, adminId, router, token]);
  return (
    <EmptyState title="Blir med..." subTitle="Blir med... Vennligst vent" />
  );
};

export default CallBackClient;
