import React from "react";
import CreateClient from "./CreateClient";
import getCurrentUser from "../server/actions/getCurrentUser";
import EmptyState from "@/components/EmptyState";
import getUserById from "../server/actions/getUserById";
import { logo } from "@/assets";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface IParams {
  userId?: string;
}

const Create = async ({ params }: { params: Promise<IParams> }) => {
  const session: any = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const currentUser = session.user;

  if (!currentUser || currentUser === null) {
    return (
      <EmptyState
        title="Uautorisert"
        subTitle="Uautorisert, vennligst logg inn"
      />
    );
  }
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
              Opprett firmakonto
            </h5>
          </div>

          <CreateClient currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default Create;
