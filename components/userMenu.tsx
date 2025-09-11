"use client";

import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useParams, useRouter } from "next/navigation";
import Avatar from "./Avatar";
import MenuItem from "./MenuItem";
import { signOut } from "next-auth/react";
import { safeUser } from "@/types";

interface UserMenuProps {
  currentUser?: safeUser | null;
  creatorByCompanyName?: any | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();

  const companyNameParams = useParams<{ companyName: string; item: string }>();
  const companyName = companyNameParams ? companyNameParams.companyName : null;
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);
  const logout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="relative lg:pr-10 xl:pr-10 2xl:pr-10">
      <div className="flex flex-row items-center gap-3 bg-white">
        <div
          onClick={() => router.push("/mine-bookinger")}
          className="z-50 hidden px-4 py-3 text-sm font-semibold transition rounded-full cursor-pointer md:block hover:bg-neutral-100"
        >
          Mine Bookinger
        </div>
        <div
          onClick={toggleOpen}
          className="
          p-4
          md:py-1
          md:px-2
          border-[1px] 
          border-neutral-200 
          flex 
          flex-row 
          items-center 
          gap-3 
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="
            absolute 
            rounded-xl 
            shadow-md
            w-[40vw]
            md:w-3/4 
            bg-white 
            overflow-hidden 
            right-2
            top-12 
            text-sm
          "
        >
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem
                  label="Mine Bookinger"
                  onClick={() => router.push("/mine-bookinger")}
                />
                <MenuItem
                  label="Book møterom"
                  onClick={() => router.push("/")}
                />
                {currentUser?.role === "admin" && (
                  <MenuItem
                    label="Alle Bookinger"
                    onClick={() =>
                      router.push(`/admin/${companyName}/alle-bookinger`)
                    }
                  />
                )}
                <MenuItem
                  label="Profil"
                  onClick={() => router.push("/profile")}
                />
                <MenuItem label="Logg ut" onClick={logout} />
              </>
            ) : (
              <>
                <MenuItem
                  label="Logg inn"
                  onClick={() => router.push("/login")}
                />
                <MenuItem
                  label="Register"
                  onClick={() => router.push("/signup")}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
