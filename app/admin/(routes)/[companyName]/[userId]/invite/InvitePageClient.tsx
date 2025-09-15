"use client";

import React, { ReactNode, useRef, useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Inputs/Input";

import Width from "@/components/Width";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
//import { safeUser } from "@/types";

interface InvitePageClientProps {
  currentUser?: any | null;
  companyName?: string;
}

const InvitePageClient = ({
  currentUser,
  companyName,
}: InvitePageClientProps) => {
  console.log("🚀 ~ companyName:", companyName);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const schema = z.object({
    email: z
      .string()
      .min(1, { message: "Epostadresse er påkrevd" })
      .email({ message: "Ugyldig epostadresse" }),
    // .refine(
    //   (email: any) =>
    //     email.endsWith("@gmail.com") || email.endsWith("@yahoo.com"),
    //   {
    //     message: "Invalid email",
    //   }
    // ),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
    resolver: async (data) => {
      try {
        await schema.parseAsync(data);
        return {
          values: data,
          errors: {},
        };
      } catch (error: any) {
        return {
          values: {},
          errors: error.errors.reduce((acc: any, curr: any) => {
            const fieldName = curr.path.join(".");
            acc[fieldName] = curr.message;
            return acc;
          }, {}),
        };
      }
    },
  });
  const submittingRef = useRef(false);
  const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    if (!isLoading) setIsLoading(true);
    const company = companyName?.replace(/\s+/g, "-");
    try {
      await axios.post(`/api/invite`, {
        email: data?.email,
        companyName: company,
        adminId: currentUser?.id,
        adminName: currentUser?.firstname,
      });

      toast.success("Invitasjon sendt!", { id: "invite-success" });

      router.push(`/admin/${companyName}/${currentUser?.id}`);
      router.refresh();
    } catch (error: any) {
      if (error.response.status === 400) {
        // Check if it's the "user already exists" error
        if (error.response.data === "User already exists, no need to invite.") {
          toast.error("Bruker eksisterer allerede, ingen invitasjon nødvendig", { id: "invite-error" });
        } else {
          toast.error("Ugyldig data motatt", { id: "invite-error" });
        }
      } else if (error.response.status === 409) {
        toast.error("Bruker er allerede invitert", { id: "invite-error" });
      } else {
        toast.error("Det har oppstått en feil", { id: "invite-error" });
      }
    } finally {
      setIsLoading(false);
      submittingRef.current = false;
    }
  };

  const handleInviteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (submittingRef.current || isLoading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    submittingRef.current = true;
    setIsLoading(true);
  };

  return (
    <form
      onSubmitCapture={(e) => {
        if (submittingRef.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Width>
        <div className="mb-3">
          <Input
            id="email"
            label="Epostadresse"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <span className="text-rose-500 text-[12px] font-semibold">
            {errors?.email as ReactNode}
          </span>
        </div>
        <p className="text-[12px] font-semibold ">
          Kun nye brukere (som ikke eksisterer i systemet) kan inviteres.
        </p>
        <Width medium>
          <Button
            label="Inviter"
            type
            loading={isLoading}
            disabled={isLoading}
            onClick={handleInviteClick}
          />
        </Width>
      </Width>
    </form>
  );
};

export default InvitePageClient;
