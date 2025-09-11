"use client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { logo } from "../../../assets";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import Input from "../../../components/Inputs/Input";
import Button from "../../../components/Button";

// Force refresh for Vercel deployment

const Authentification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const schema = z.object({
    email: z
      .string()
      .min(1, { message: "Epostadresse er påkrevd" })
      .email({ message: "Ugyldig epostadresse" }),

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

  const onSubmit: SubmitHandler<FieldValues> = (data, e) => {
    e?.preventDefault();

    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
      callbackUrl: "/",
    })
      .then((callback) => {
        if (callback?.ok) {
          toast.success("Logget inn");
          router.push("/");
        }

        if (callback?.error) {
          toast.error(callback.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
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
              Logg inn
            </h5>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <Input
                  id="email"
                  label="Email"
                  type="text"
                  disabled={isLoading}
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
                <Button label="Logg inn" type />
              </div>
            </form>

            <div className="mb-3">
              <Button
                label="Fortsett med Google "
                icon={FaGoogle}
                onClick={handleGoogleLogin}
              />
            </div>
            <div className="flex items-center justify-center my-4 text-lg font-semibold text-black ">
              <p className="text-[15px]">
                Har du ikke bruker?&nbsp;
                <span
                  onClick={() => router.push("/signup")}
                  className="cursor-pointer text-primary"
                >
                  Registrer deg
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentification;
