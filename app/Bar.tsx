"use client";
import { signOut, useSession } from "next-auth/react";

interface BarProps {
  currentUser: any | null;
  routes: any | null;
  rooms: any | null;
}
const Bar = ({ currentUser, routes, rooms }: BarProps) => {
  // Use client-side session for real-time updates
  const { data: session, status } = useSession();
  const clientUser = session?.user || currentUser;
  
  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };
  return (
    <div className="flex items-center justify-end pr-4 bg-white">
      {status !== "loading" && clientUser ? (
        <>
          <div className="w-auto">
            <ul className="flex items-center mr-8">
              <li
                onClick={logout}
                className="font-medium tracking-tight cursor-pointer hover:font-semibold hover:text-gray-900"
              >
                Logg&nbsp;ut
              </li>
            </ul>
          </div>
          {clientUser?.role === "admin" ? (
            <div className="w-auto">
              <div className="inline-block">
                <a
                  className="inline-block px-5 py-3 font-semibold tracking-tight text-center text-white transition duration-200 rounded-lg bg-primary hover:bg-secondary focus:ring-4 focus:ring-indigo-300"
                  href={`/admin/${
                    routes?.creator?.firmanavn ||
                    routes?.company?.firmanavn ||
                    undefined
                  }/${
                    routes?.creator?.userId ||
                    routes?.company?.userId ||
                    undefined
                  }`}
                >
                  Administrer
                </a>
              </div>
            </div>
          ) : (
            <div className="w-auto">
              <div className="inline-block">
                <a
                  className="inline-block px-5 py-3 font-semibold tracking-tight text-center text-white transition duration-200 rounded-lg bg-primary hover:bg-secondary focus:ring-4 focus:ring-indigo-300"
                  href={`/admin/${
                    routes?.creator?.firmanavn ||
                    routes?.company?.firmanavn ||
                    undefined
                  }/${
                    routes?.creator?.userId ||
                    routes?.company?.userId ||
                    undefined
                  }/rooms`}
                >
                  Reserver
                </a>
              </div>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Bar;
