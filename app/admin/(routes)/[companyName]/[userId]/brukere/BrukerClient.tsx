"use client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ReactNode, useState } from "react";
import axios from "axios";
import Input from "@/components/Inputs/Input";
import Button from "@/components/Button";
import Width from "@/components/Width";
import { sendCreationMail } from "@/lib/sendMail";
import crypto from "crypto";

interface BrukerClientProps {
  currentUser?: any | null;
}
const BrukerClient = ({ currentUser }: BrukerClientProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ userId: string; item: string }>();
  const userId = params ? params.userId : null;
  const companyNameParams = useParams<{ companyName: string; item: string }>();
  const companyName = companyNameParams ? companyNameParams.companyName : null;
  const adminId = currentUser?.id;

  const router = useRouter();
  const schema = z.object({
    email: z
      .string()
      .min(1, { message: "Epostadresse er påkrevd" })
      .email({ message: "Ugyldig Epostadresse" }),
    firstname: z.string().min(3, { message: "Fornavn er påkrevd" }),
    lastname: z.string().min(3, { message: "Etternavn er påkrevd" }),

    password: z
      .string()
      .min(3, { message: "Passordet må være minst 8 karakterer langt" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
      password: "",
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
      const response = await axios.post("/api/invite/admin-join", {
        email: data?.email,
        firstname: data?.firstname,
        lastname: data?.lastname,
        password: data?.password,
        companyName,
        userId,
        adminId,
      });
      console.log(response.data);

      toast.success("Bruker opprettet!");
      router.push(`/admin/${companyName?.replace(/\s+/g, "-")}/${adminId}`);
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data || "Noe gikk galt";
      if (status === 409) {
        // Server returns: "User already invited to this company"
        toast.error(message);
      } else if (status === 400) {
        toast.error(message);
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
      //const subject = `En bruker har blitt opprettet for deg av firmaet: ${companyName}`;
      //const htmlContent = `
      //<p>Hei ${data?.firstname} ${data?.lastname}</p>
      //<p><a href="https://www.holdav.no/login">Klikk her</a> for å logge inn!</p>
      //
      //<p>Vennlig Hilsen,<br/>
      //holdav.no</p>
      //`;
      //
      //sendCreationMail(data?.email, "Opprettet", subject, htmlContent);
      //
    }
  };
  return (
    <Width>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <Input
              id="firstname"
              label="Fornavn"
              type="text"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
            {errors && (
              <span className="text-rose-500">
                {errors?.firstname as ReactNode}
              </span>
            )}
          </div>
          <div className="mb-3">
            <Input
              id="lastname"
              label="Etternavn"
              type="text"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
            {errors && (
              <span className="text-rose-500">
                {errors?.lastname as ReactNode}
              </span>
            )}
          </div>
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
            <span className="text-rose-500">{errors?.email as ReactNode}</span>
          </div>
          <div className="mb-3">
            <Input
              id="password"
              label="Passord"
              type="password"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
            <span className="text-rose-500">
              {errors?.password as ReactNode}
            </span>
          </div>

          <div className="mb-3">
            <Button label="Opprett" type />
          </div>
        </form>
      </div>
    </Width>
  );
};

export default BrukerClient;
