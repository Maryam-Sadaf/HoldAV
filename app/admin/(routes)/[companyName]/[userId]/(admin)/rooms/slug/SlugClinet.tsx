"use client";
import React, { ReactNode, useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Inputs/Input";

import Width from "@/components/Width";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
//import { safeUser } from "@/types";

interface SlugClientProps {
  currentUser?: any | null;
  userById?: any | null;
}

const SlugClinet = ({ currentUser, userById }: SlugClientProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const schema = z.object({
    name: z.string().min(3, { message: "Navn er påkrevd" }),
  });
  const companyNameParams = useParams<{ companyName: string; item: string }>();
  const companyName = companyNameParams ? companyNameParams.companyName : null;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
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
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {
    setIsLoading(true);
    try {
      const roomName = data?.name;
      if (typeof roomName === "string") {
        const response = await axios.post(`/api/rooms/create-room`, {
          name: roomName.trim(), // Keep original casing, just trim whitespace
          companyName: companyName,
        });

        const newRoom = response.data;

        // Optimistic update: Add the new room to the cache immediately
        queryClient.setQueryData(["roomsForCompany", companyName], (oldData: any) => {
          if (!oldData) return [newRoom];
          // Check if room already exists to avoid duplicates
          const exists = oldData.some((room: any) => room.id === newRoom.id);
          if (exists) return oldData;
          return [...oldData, newRoom];
        });

        toast.success("Møterom Opprettet");

        // Invalidate and refetch the rooms query to ensure fresh data
        await queryClient.invalidateQueries({ queryKey: ["roomsForCompany", companyName] });
        await queryClient.refetchQueries({ queryKey: ["roomsForCompany", companyName] });

        // Navigate to rooms page - the optimistic update will show immediately
        router.push(
          `/admin/${companyName?.replace(/\s+/g, "-")}/${currentUser?.id}/rooms`
        );
      } else {
        toast.error("Ugyldig navn");
      }
    } catch (error: any) {
      console.log(error);
      // Revert optimistic update on error by invalidating and refetching
      queryClient.invalidateQueries({ queryKey: ["roomsForCompany", companyName] });
      queryClient.refetchQueries({ queryKey: ["roomsForCompany", companyName] });
      if (error.response) {
        // Check the status code and customize the error message accordingly
        if (error.response.status === 400) {
          toast.error("Bruker eksisterer ikke");
        }
        toast.error("Det har oppstått en feil");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Width>
        <div className="mb-3">
          <Input
            id="name"
            label="Møterom navn"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <span className="text-rose-500 text-[12px] font-semibold">
            {errors?.name as ReactNode}
          </span>
        </div>
        <p className="text-[12px] font-semibold "></p>
        <Width medium>
          <Button label="Legg til" type />
        </Width>
      </Width>
    </form>
  );
};

export default SlugClinet;
