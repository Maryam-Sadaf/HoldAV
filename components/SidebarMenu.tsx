"use client";

import React from "react";
import { Montserrat } from "next/font/google";
const poppins = Montserrat({ weight: "600", subsets: ["latin"] });
import {
  MdHome,
  MdBookmarkAdd,
  MdScreenshotMonitor,
  MdMeetingRoom,
  MdAccountTree,
  MdOutlineLogout,
  MdPeople,
} from "react-icons/md";
import { FaBuildingShield } from "react-icons/fa6";
import { FaUsers, FaUser } from "react-icons/fa";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
//import { safeUser } from "@/types";
import Link from "next/link";

interface SidebarProps {
  currentUser?: any | null;
}

const routes = [
  {
    label: "Hjem",
    icon: MdHome,
    href: "/admin",
    color: "text-sky-500",
  },
  {
    label: "Booking",
    icon: MdBookmarkAdd,
    href: "/admin/booking",
    color: "text-violet-500",
  },
  {
        label: "All Users",
        icon: MdPeople,
        color: "text-light",
        href: "/all-users",
      },
  {
    label: "Infoskjerm",
    icon: MdScreenshotMonitor,
    color: "text-pink-700",
    href: "/admin/infoskjerm",
  },
  {
    label: "Møterom",
    icon: MdMeetingRoom,
    color: "text-orange-700",
    href: "/admin/rooms",
  },
  {
    label: "Bygninger",
    icon: FaBuildingShield,
    color: "text-emerald-500",
    href: "/admin/bygninger",
  },
  {
    label: "Brukere",
    icon: FaUsers,
    color: "text-green-700",
    href: "/admin/brukere",
  },
  {
    label: "Profil",
    icon: FaUser,
    href: "/profile",
  },

  {
    label: "Konto",
    icon: MdAccountTree,
    color: "text-green-300",
    href: "/admin/konto",
  },
  {
    label: "Logg ut",
    icon: MdOutlineLogout,
    href: "/login",
    color: "text-violet-300",
    onClick: () => signOut({ callbackUrl: "/login" }),
  },
];
const SidebarMenu = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
            pathname === route.href ? "text-white bg-white/15" : "text-zinc-400"
          )}
        >
          <div className="flex items-center flex-1" onClick={route.onClick}>
            <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
            {route.label}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SidebarMenu;
