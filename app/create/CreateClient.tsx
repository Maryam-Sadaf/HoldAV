"use client";
import Input from "@/components/Inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import React, { ReactNode, useEffect, useState } from "react";
import Button from "@/components/Button";
import axios from "axios";
import { useSession } from "next-auth/react";

interface CreateClientProps {
  currentUser?: any | null;
}

const CreateClient: React.FC<CreateClientProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();
  const schema = z.object({
    organisasjonsnummer: z
      .string()
      .min(1, { message: "Organisasjons nummer er påkrevd" }),
    firmanavn: z.string().min(3, { message: "Firma navn er påkrevd" }),
    adresse: z.string().min(3, { message: "Adresse er påkrevd" }),
    postnummer: z.string().min(3, { message: "Post nummer er påkrevd" }),
    poststed: z.string().min(3, { message: "Poststed er påkrevd" }),
    fornavn: z.string().min(3, { message: "Fornavn er påkrevd" }),
    etternavn: z.string().min(3, { message: "Etternavn er påkrevd" }),
    epost: z.string().min(3, { message: "E-Post er påkrevd" }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      organisasjonsnummer: "",
      firmanavn: "",
      adresse: "",
      postnummer: "",
      poststed: "",
      fornavn: currentUser?.firstname || "",
      etternavn: currentUser?.lastname || "",
      epost: currentUser?.email || "",
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
  const onSubmit: SubmitHandler<FieldValues> = async (data, e) => {
    e?.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/create-company", data);
      //console.log("🚀 ~ response:", response);

      toast.success("Firma opprettet!");
      await update({
        ...session,
        user: {
          ...session?.user,
          role: "admin",
        },
      });

      router.push(
        `/admin/${response?.data?.firmanavn?.replace(/\s+/g, "-")}/${
          currentUser?.id
        }/rooms`
      );
    } catch (error) {
      toast.error(
        "Noe gikk galt. \n Potensielt: Firmanavn eksisterer allerede."
      );
      console.error("Error in onSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <Input
            id="organisasjonsnummer"
            label="Organisasjonsnummer"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <span className="text-rose-500 text-[12px] font-semibold">
            {errors?.organisasjonsnummer as ReactNode}
          </span>
        </div>

        <div className="mb-2">
          <Input
            id="firmanavn"
            label="Firmanavn"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <span className="text-rose-500 text-[12px] font-semibold">
            {errors?.firmanavn as ReactNode}
          </span>
        </div>
        <div className="mb-2">
          <Input
            id="adresse"
            label="Adresse"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <span className="text-rose-500 text-[12px] font-semibold">
            {errors?.adresse as ReactNode}
          </span>
        </div>
        <div className="mb-2">
          <Input
            id="postnummer"
            label="Postnummer"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <span className="text-rose-500 text-[12px] font-semibold">
            {errors?.postnummer as ReactNode}
          </span>
        </div>

        <div className="mb-2">
          <Input
            id="poststed"
            label="Poststed"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <span className="text-rose-500 text-[12px] font-semibold">
            {errors?.poststed as ReactNode}
          </span>
        </div>
        <div className="mb-2">
          <Input
            id="fornavn"
            label="Fornavn"
            type="text"
            register={register}
            errors={errors}
            required
            disabled
          />
          <span className="text-rose-500 text-[12px] font-semibold">
            {errors?.fornavn as ReactNode}
          </span>
        </div>
        <div className="mb-2">
          <Input
            id="etternavn"
            label="Etternavn"
            type="text"
            disabled
            register={register}
            errors={errors}
            required
          />
          <span className="text-rose-500 text-[12px] font-semibold">
            {errors?.etternavn as ReactNode}
          </span>
        </div>
        <div className="mb-2">
          <Input
            id="epost"
            label="E-post"
            type="text"
            register={register}
            errors={errors}
            required
            disabled
            bgBackground
          />
          <span className="text-rose-500 text-[12px] font-semibold">
            {errors?.epost as ReactNode}
          </span>
        </div>

        <div className="mt-4 mb-2">
          <Button label="Opprett" type />
        </div>
      </form>
    </div>
  );
};

export default CreateClient;
