"use client";
import Image from "next/image";
import React from "react";
import NextLink from "next/link";
import { Link, animateScroll as scroll } from "react-scroll";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";

const NavbarDrawer = ({ handleNav, currentUser }: { handleNav: () => void; currentUser?: any | null }) => {
  const router = useRouter();
  const currentRoute = usePathname();
  const isFrontPage = currentRoute === "/";
  return (
    <div className="fixed top-0 bottom-0 left-0 z-50 w-5/6 max-w-sm navbar-menu">
      <div className="fixed inset-0 bg-gray-800 opacity-25 navbar-backdrop" />
      <nav className="relative flex flex-col w-full h-full px-6 py-6 overflow-y-auto bg-white border-r">
        <div className="flex items-center mb-8">
          <NextLink
            className="mr-auto text-3xl font-bold leading-none"
            href="/"
          >
            <Image
              className="h-10"
              src="/logo_purple_dark_v2.svg"
              alt=""
              width="125"
              height="60"
            />
          </NextLink>
          <button onClick={handleNav} className="navbar-close">
            <svg
              className="w-8 h-8 cursor-pointer text-primary hover:text-dark"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div>
          <ul className="pt-4 pb-8">
            <li className="mb-1">
              <Link
                className="block p-4 text-sm font-semibold text-gray-400 rounded cursor-pointer hover:bg-primary/20 hover:text-primary hover:font-bold"
                to="hjem"
                onClick={handleNav}
                smooth={true}
                duration={800}
                spy={true}
              >
                Hjem
              </Link>
            </li>

            <li className="mb-1">
              {isFrontPage ? (
                <Link
                  className="block p-4 text-sm font-semibold text-gray-400 rounded cursor-pointer hover:bg-primary/20 hover:text-primary hover:font-bold"
                  to="funksjoner"
                  onClick={handleNav}
                  smooth={true}
                  duration={800}
                  spy={true}
                >
                  Funksjoner
                </Link>
              ) : (
                <NextLink
                  className="block p-4 text-sm font-semibold text-gray-400 rounded cursor-pointer hover:bg-primary/20 hover:text-primary hover:font-bold"
                  href="/#funksjoner"
                >
                  Funksjoner
                </NextLink>
              )}
            </li>
            <li className="mb-1">
              {isFrontPage ? (
                <Link
                  onClick={handleNav}
                  className="block p-4 text-sm font-semibold text-gray-400 rounded cursor-pointer hover:bg-primary/20 hover:text-primary hover:font-bold"
                  to="integrasjoner"
                  smooth={true}
                  duration={800}
                  spy={true}
                >
                  Integrasjoner
                </Link>
              ) : (
                <NextLink
                  className="block p-4 text-sm font-semibold text-gray-400 rounded cursor-pointer hover:bg-primary/20 hover:text-primary hover:font-bold"
                  href="/#integrasjoner"
                >
                  Integrasjoner
                </NextLink>
              )}
            </li>
            <li className="mb-1">
              {isFrontPage ? (
                <Link
                  onClick={handleNav}
                  className="block p-4 text-sm font-semibold text-gray-400 rounded cursor-pointer hover:bg-primary/20 hover:text-primary hover:font-bold"
                  to="priser"
                  smooth={true}
                  duration={800}
                  spy={true}
                >
                  Priser
                </Link>
              ) : (
                <NextLink
                  className="block p-4 text-sm font-semibold text-gray-400 rounded cursor-pointer hover:bg-primary/20 hover:text-primary hover:font-bold"
                  href="/#priser"
                >
                  Priser
                </NextLink>
              )}
            </li>
          </ul>

          {!currentUser && (
            <div className="flex flex-col justify-end w-full py-8">
              <NextLink
                className="inline-block px-5 py-3 font-semibold tracking-tight text-center transition duration-200 border-2 rounded-lg border-primary text-primary hover:bg-primary hover:text-white focus:ring-4 focus:ring-dark"
                href="/login"
              >
                Logg inn
              </NextLink>
            </div>
          )}
          {!currentUser && (
            <div className="flex flex-col justify-end w-full pb-8">
              <NextLink
                className="inline-block px-5 py-3 font-semibold tracking-tight text-center text-white transition duration-200 rounded-lg bg-primary hover:bg-secondary focus:ring-4 focus:ring-dark"
                href="/signup"
              >
                Kom i gang
              </NextLink>
            </div>
          )}
        </div>
        <div className="mt-auto">
          <p className="my-4 text-xs text-center text-gray-400">
            <span>
              &copy; {new Date().getFullYear()} HOLD AV - Alle rettigheter
              forbeholdt
            </span>
          </p>
        </div>
      </nav>
    </div>
  );
};

export default NavbarDrawer;
