"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { safeUser } from "@/types";
import { signOut } from "next-auth/react";

interface NavbarProps {
  currentUser?: safeUser | null;
  creatorByCompanyName?: any | null;
}

const NavMenu = ({ currentUser, creatorByCompanyName }: NavbarProps) => {
  const pathname = usePathname();
  const companyNameParams = useParams<{ companyName: string; item: string }>();
  const companyName = companyNameParams ? companyNameParams.companyName : null;
  const routes = [
    {
      href: `/admin/${companyName}/${creatorByCompanyName?.userId}`,
      label: "Manage",
      active: pathname === "/book-møterom",
    },
    {
      href: "/møterom",
      label: "Møterom",
      active: pathname === "/møterom",
    },
    {
      href: "/mine-bookinger",
      label: "Mine Bookinger",
      active: pathname === "/mine-bookinger",
    },
    ...(currentUser?.role === "admin"
      ? [
          {
            href: `/admin/${companyName}/alle-bookinger`,
            label: "Alle Bookinger",
            active: pathname === "/alle-bookinger",
          },
        ]
      : []),

    {
      href: "/profile",
      label: "Profile",
      active: pathname === "/profile",
    },
    {
      href: "/login",
      label: "Logg ut",
      active: pathname === "/login",
      onClick: () => signOut({ callbackUrl: "/login" }),
    },
  ];

  return (
    <div className="flex items-center w-full text-[#2a44a1] justify-between">
      {routes.map((route) => (
        <Link key={route.href} href={route.href}>
          <div
            onClick={route.onClick}
            className={cn(
              "text-[12px] flex p-3 mr-2 font-sm  cursor-pointer",
              pathname === route.href ? "text-[#2a44a1]" : "text-black"
            )}
          >
            {route.label}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NavMenu;
