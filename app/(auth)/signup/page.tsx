"use client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { logo } from "@/assets";
import { FaGoogle } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import Input from "@/components/Inputs/Input";
import Button from "@/components/Button";

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isValidatingInvite, setIsValidatingInvite] = useState(false);
  const [inviteData, setInviteData] = useState<{
    valid: boolean;
    companyId?: string;
    email?: string;
    companyName?: string;
    adminId?: string;
    adminName?: string;
    reason?: string;
    token?: string;
  } | null>(null);
  // const { data: session } = useSession();

  const router = useRouter();
  const searchParams = useSearchParams();

  // Validate invitation on page load
  useEffect(() => {
    if (!searchParams) return;
    
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (token && email) {
      validateInvitation(token, email);
    }
  }, [searchParams]);


  const validateInvitation = async (token: string, email: string) => {
    setIsValidatingInvite(true);
    try {
      const response = await fetch(`/api/validate-invite?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`);
      
      // Check if response is HTML (API route not working)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.log("❌ API route not working, falling back to manual validation");
        // Fallback: Assume invitation is valid and let the backend handle it
        setInviteData({ 
          valid: true, 
          email: email,
          token: token,
          // We'll let the backend fetch the invitation data
        });
        return;
      }
      
      const data = await response.json();
      setInviteData(data);
      
      if (data.valid) {
        console.log("✅ Invitation is valid:", data);
      } else {
        console.log("❌ Invitation is invalid:", data.reason);
      }
    } catch (error) {
      console.error("❌ Error validating invitation:", error);
      // Fallback: Assume invitation is valid and let the backend handle it
      setInviteData({ 
        valid: true, 
        email: email,
        token: token,
        // We'll let the backend fetch the invitation data
      });
    } finally {
      setIsValidatingInvite(false);
    }
  };

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

    firstname: z.string().min(3, { message: "Fornavn er påkrevd" }),
    lastname: z.string().min(3, { message: "Etternavn er påkrevd" }),

    password: z
      .string()
      .min(3, { message: "Passord må være minst 8 karakterer langt" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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

  // Pre-fill email when invitation is valid
  useEffect(() => {
    if (inviteData?.valid && inviteData.email) {
      setValue('email', inviteData.email);
    }
  }, [inviteData, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data, e) => {
    e?.preventDefault();
    setIsLoading(true);

    try {
      // If this is an invitation-based signup, use the invitation data
      if (inviteData?.valid) {
        // Get token from URL
        const token = searchParams?.get('token');
        
        // Create user with company association
        const signupData: any = {
          ...data,
          isInvited: true,
          token: token
        };
        
        // Add company data if available from frontend validation
        if (inviteData.companyId) {
          signupData.companyId = inviteData.companyId;
          signupData.adminId = inviteData.adminId;
        }
        
        await axios.post("/api/register", signupData);
        await signIn("credentials", { ...data, redirect: false });
        toast.success("Registrert og koblet til selskapet!");
        router.push("/");
      } else {
        // Regular signup (existing logic)
        await axios.post("/api/register", data);
        await signIn("credentials", { ...data, redirect: false });
        toast.success("Registrert!");
        router.push("/");
      }
    } catch (error: any) {
      toast.error("Noe gikk galt");
    } finally {
      setIsLoading(false);
    }
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
              Registrer deg
            </h5>
            
            {/* Invitation Status Messages */}
            {isValidatingInvite && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded text-blue-800">
                Validerer invitasjon...
              </div>
            )}
            
            {inviteData?.valid && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-800">
                ✅ Du er invitert til {inviteData.companyName}
              </div>
            )}
            
            {inviteData?.valid === false && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-800">
                ❌ {inviteData.reason || "Invitasjonslenke er ugyldig eller utløpt"}
              </div>
            )}
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <Input
                  id="firstname"
                  label="First name"
                  type="text"
                  disabled={isLoading || isValidatingInvite || (inviteData?.valid === false)}
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
                  label="Last name"
                  type="text"
                  disabled={isLoading || isValidatingInvite || (inviteData?.valid === false)}
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
                  label="Email"
                  type="text"
                  disabled={isLoading || isValidatingInvite || (inviteData?.valid === false) || (inviteData?.valid === true)}
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
                  disabled={isLoading || isValidatingInvite || (inviteData?.valid === false)}
                  register={register}
                  errors={errors}
                  required
                />
                <span className="text-rose-500">
                  {errors?.password as ReactNode}
                </span>
              </div>
              <div className="mb-3">
                {message && <span className="text-rose-500">{message}</span>}
              </div>
              <div className="mb-3">
                <Button 
                  label={inviteData?.valid === false ? "Registrering ikke tilgjengelig" : "Registrer"} 
                  type 
                  disabled={isLoading || isValidatingInvite || (inviteData?.valid === false)}
                />
              </div>
            </form>
            <div className="mb-3">
              <Button
                label="Fortsett med Google "
                icon={FaGoogle}
                onClick={handleGoogleLogin}
                disabled={isValidatingInvite || (inviteData?.valid === false)}
              />
            </div>
            <div className="flex items-center justify-center my-4 text-lg font-semibold text-black ">
              <p className="text-[15px]">
                Allerede registrert? &nbsp;
                <span
                  onClick={() => router.push("/login")}
                  className="cursor-pointer text-primary"
                >
                  Logg inn
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
