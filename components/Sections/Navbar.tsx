"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Link, animateScroll as scroll } from "react-scroll";
import { usePathname, useRouter } from "next/navigation";
import NextLink from "next/link";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
const NavbarDrawer = dynamic(() => import("./NavbarDrawer"), { ssr: false });
import { CiMenuFries } from "react-icons/ci";

interface NavProps {
  currentUser: any | null;
}

const Navbar = ({ currentUser }: NavProps) => {
  const [nav, setNav] = useState(false);
  const router = useRouter();
  const currentRoute = usePathname();
  const isFrontPage = currentRoute === "/";
  
  // Use client-side session to get real-time user state
  const { data: session } = useSession();
  const clientUser = session?.user || currentUser;

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <section className="w-full bg-white">
      <nav className="container px-4 mx-auto">
        <div className="flex items-center justify-between py-5">
          <div className="w-auto">
            <div className="flex flex-wrap items-center">
              <div className="w-auto pr-2 lg:pr-14">
                <NextLink className="" href="/" prefetch={false}>
                  <Image
                    className="h-12"
                    src="/logo_purple_dark_v2.svg"
                    alt=""
                    width="150"
                    height="75"
                  />
                </NextLink>
              </div>
              <div className="hidden w-auto lg:block">
                <ul className="flex items-center mr-8">
                  <li className="font-medium tracking-tight cursor-pointer mr-14 hover:font-semibold hover:text-gray-900">
                    {isFrontPage ? (
                      <Link
                        to="funksjoner"
                        smooth={true}
                        duration={800}
                        spy={true}
                      >
                        Funksjoner
                      </Link>
                    ) : (
                      <NextLink
                        className="font-medium tracking-tight cursor-pointer hover:font-semibold hover:text-gray-900"
                        href="/#funksjoner"
                        prefetch={false}
                      >
                        Funksjoner
                      </NextLink>
                    )}
                  </li>
                  <li className="font-medium tracking-tight cursor-pointer mr-14 hover:font-semibold hover:text-gray-900">
                    {isFrontPage ? (
                      <Link
                        to="integrasjoner"
                        smooth={true}
                        duration={800}
                        spy={true}
                      >
                        Integrasjoner
                      </Link>
                    ) : (
                      <NextLink
                        className="font-medium tracking-tight cursor-pointer hover:font-semibold hover:text-gray-900"
                        href="/#integrasjoner"
                        prefetch={false}
                      >
                        Integrasjoner
                      </NextLink>
                    )}
                  </li>
                  <li className="font-medium tracking-tight cursor-pointer hover:font-semibold hover:text-gray-900">
                    {isFrontPage ? (
                      <Link to="priser" smooth={true} duration={800} spy={true}>
                        Priser
                      </Link>
                    ) : (
                      <NextLink
                        className="font-medium tracking-tight cursor-pointer hover:font-semibold hover:text-gray-900"
                        href="/#priser"
                        prefetch={false}
                      >
                        Priser
                      </NextLink>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-auto">
            <div className="flex flex-wrap items-center">
              <div
                className={`hidden w-auto ${!clientUser ? "lg:block" : ""}`}
              >
                <ul className="flex items-center mr-8">
                  <li className="font-medium tracking-tight cursor-pointer hover:font-semibold hover:text-gray-900">
                    <NextLink href="/login" prefetch={false}>Logg inn</NextLink>
                  </li>
                </ul>
              </div>
              <div
                className={`hidden w-auto ${!clientUser ? "lg:block" : ""}`}
              >
                <div className="inline-block">
                  <NextLink
                    className="inline-block px-5 py-3 font-semibold tracking-tight text-center text-white transition duration-200 rounded-lg bg-primary hover:bg-secondary focus:ring-4 focus:ring-indigo-300"
                    href="/signup"
                    prefetch={false}
                  >
                    Kom i gang
                  </NextLink>
                </div>
              </div>
              <div className="w-auto lg:hidden">
                <div onClick={handleNav}>
                  <div className="text-dark">
                    <CiMenuFries size={35} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {nav && <NavbarDrawer handleNav={handleNav} currentUser={clientUser} />}
    </section>
  );
};

export default Navbar;
