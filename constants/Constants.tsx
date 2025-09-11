import {
  MdHome,
  MdBookmarkAdd,
  MdScreenshotMonitor,
  MdMeetingRoom,
  MdAccountTree,
  MdOutlineLogout,
} from "react-icons/md";
import { FaBuildingShield } from "react-icons/fa6";
import { FaUsers, FaUser, FaPlus } from "react-icons/fa";

import { signOut } from "next-auth/react";
import getCurrentUser from "@/app/server/actions/getCurrentUser";
const useRoutes = (currentUser: any) => {
  return [
    {
      label: "Hjem",
      icon: MdHome,
      href: "/",
      color: "text-sky-500",
    },
    ...(currentUser?.role === "admin"
      ? [
          {
            label: "Booking",
            icon: MdBookmarkAdd,
            href: "/booking",
            color: "text-violet-500",
          },
        ]
      : []),
    {
      label: "Infoskjerm",
      icon: MdScreenshotMonitor,
      color: "text-pink-700",
      href: "/infoskjerm",
    },
    {
      label: "Møterom",
      icon: MdMeetingRoom,
      color: "text-orange-700",
      href: "/rooms",
    },
    {
      label: "Bygninger",
      icon: FaBuildingShield,
      color: "text-emerald-500",
      href: "/bygninger",
    },
    {
      label: "Brukere",
      icon: FaUsers,
      color: "text-green-700",
      href: "/brukere",
    },
    {
      label: "Profil",
      icon: FaUser,
      href: "/profile",
    },
    {
      label: "invite",
      icon: FaPlus,
      href: "/invite",
      color: "text-violet-900",
    },

    {
      label: "Konto",
      icon: MdAccountTree,
      color: "text-green-300",
      href: "/konto",
    },
    {
      label: "Logg ut",
      icon: MdOutlineLogout,
      href: "/login",
      color: "text-violet-300",
      onClick: () => signOut({ callbackUrl: "/login" }),
    },
  ];
};
const Constants = () => {
  const currentUser = getCurrentUser();

  const routes = useRoutes(currentUser);

  return;
};

export default Constants;
