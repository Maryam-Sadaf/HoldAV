"use client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { logo } from "@/assets";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import Input from "@/components/Inputs/Input";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import axios from "axios";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const isInvite = searchParams?.get("invite");
  const token = searchParams?.get("token");
  const email = searchParams?.get("email");
  const companyNameParams = useParams<{ companyName: string; item: string }>();
  const companyName = companyNameParams ? companyNameParams.companyName : null;
  const adminParams = useParams<{ adminId: string; item: string }>();
  const adminId = adminParams ? adminParams.adminId : null;

  const invitationLink = `http://www.holdav.no/redirect/${companyName?.replace(
    /\s+/g,
    "-"
  )}/${adminId}/callback?token=${token}`;

  const schema = z.object({
    firstname: z
      .string()
      .min(1, { message: "Fornavn er påkrevd" }),
    lastname: z
      .string()
      .min(1, { message: "Etternavn er påkrevd" }),
    email: z
      .string()
      .min(1, { message: "Epostadresse er påkrevd" })
      .email({ message: "Ugyldig epostadresse" }),
    password: z
      .string()
      .min(3, { message: "Passord må være minst 8 karakterer langt" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: email || "",
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
      // Register new user with invitation
      await axios.post("/api/invite/admin-join", {
        companyName: companyName,
        adminId: adminId,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        password: data.password,
        token: token, // Pass the invitation token
      });

      // After successful registration, sign in the user
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        toast.success("Registrering vellykket!");
        router.push(invitationLink);
      } else {
        toast.error("Registrering vellykket, men innlogging feilet");
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response?.status === 409) {
        toast.error("Bruker er allerede invitert til dette firmaet");
      } else {
        toast.error("Registrering feilet. Prøv igjen.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    // For Google signup, we'll redirect to the main signup page
    router.push("/signup");
  };

  return (
    <div className="relative w-full mx-auto bg-gradient-to-b from-[#F5F5F5] to-[#fff] min-h-[100vh] ">
      <div>
        <div className="h-auto bg-secondary w-full p-8 mb-[30px]">
          <div className="flex flex-col items-center justify-center w-full">
            <Link href="/" className="flex w-full mx-auto">
              <Image src={logo} width={200} height={100} alt="logo" />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full mx-auto   max-w-[900px] lg:max-w-[730px] min-h-[80vh] md:max-w-[500px] sm:max-w-[100%] px-10 rounded-[7px]">
        <div className="flex flex-col justify-center w-full">
          <div className="pt-10  mx-auto text-center max-w-[400px] border-b border-black mb-10">
            <h5 className="xl:text-[2.1rem] lg:text-[2.1rem] text-[2rem]  uppercase italic font-[700] text-black pb-8">
              Registrer deg
            </h5>
          </div>
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
                <span className="text-rose-500">
                  {errors?.firstname as ReactNode}
                </span>
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
                <span className="text-rose-500">
                  {errors?.lastname as ReactNode}
                </span>
              </div>

              <div className="mb-3">
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  disabled={isLoading || !!email}
                  register={register}
                  errors={errors}
                  required
                />
                <span className="text-rose-500">
                  {errors?.email as ReactNode}
                </span>
              </div>

              <div className="mb-3">
                <Input
                  id="password"
                  label="Password"
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
                {message && <span className="text-rose-700">{message}</span>}
              </div>
              <div className="mb-3">
                <Button label="Registrer deg" type />
              </div>
            </form>

            <div className="mb-3">
              <Button
                label="Continue with Google "
                icon={FaGoogle}
                onClick={handleGoogleSignup}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
