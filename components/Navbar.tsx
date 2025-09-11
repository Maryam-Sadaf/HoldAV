"use client";
import Image from "next/image";
import MobileSidebar from "./MobileSidebar";
import NavMenu from "./NavMenu";
import { useRouter } from "next/navigation";
import UserMenu from "./userMenu";
import { logo } from "@/assets";
import { MdMeetingRoom } from "react-icons/md";
import { cn } from "@/lib/utils";
import Link from "next/link";
//import { safeUser } from "@/types";
import { useSession } from "next-auth/react";
interface NavbarProps {
  Logo?: boolean;
  navMenu?: boolean;
  user?: boolean;
  className?: React.HTMLAttributes<HTMLElement>;
  currentUser?: any | null;
  creatorByCompanyName?: any | null;
}
const Navbar = ({
  Logo,
  user,
  creatorByCompanyName,
  navMenu,
  className,
  currentUser,
}: NavbarProps) => {
  return (
    <div className={cn("flex items-center py-7 justify-between", className)}>
      {Logo && (
        <div className="flex items-center w-full text-lg font-bold bg-red-500 ">
          <Link href="/">
            <Image
              className="h-12"
              src="/logo_purple_dark_v2.svg"
              alt=""
              width="150"
              height="75"
            />
            {/*
            
            <div className="items-center hidden w-full text-lg font-bold sm:hidden md:flex lg:flex xl:flex 2xl:flex">
              <MdMeetingRoom size={40} color="#2a44a1" />
              HOLD AV
            </div>
      */}
          </Link>
        </div>
      )}
      <div>
        <MobileSidebar />
      </div>
      {/*
      <NavMenu
        currentUser={currentUser}
        creatorByCompanyName={creatorByCompanyName}
      />
    
      {navMenu && (
        <div className="flex justify-end w-full">
          <div className="hidden sm:hidden md:hidden lg:hidden xl:flex 2xl:flex">
            <NavMenu currentUser={currentUser} />
          </div>
          <div className="flex sm:flex md:flex lg:flex xl:hidden 2xl:hidden">
            <UserMenu currentUser={currentUser} />
          </div>
        </div>
      )}
      {user && (
        <div className="flex justify-end w-full">
          <UserMenu currentUser={currentUser} />
        </div>
      )}
      */}
    </div>
  );
};

export default Navbar;
