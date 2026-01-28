import Image from "next/image";
import Link from "next/link";
import React from "react";

interface PricingProps {
  currentUser?: any | null;
}

const Pricing = ({ currentUser }: PricingProps) => {
  return (
    <section
      id="priser"
      className="w-full py-24 overflow-hidden bg-gray-100 lg:py-32"
    >
      <div className="container px-0 mx-auto max-w-5xl">
        <div className="flex flex-wrap justify-center -m-4">
          <div className="w-full p-4 md:w-1/2 lg:w-1/3 max-w-sm">
            <div className="p-5 transition duration-500 transform bg-white rounded-lg hover:-translate-y-2">
              <div className="text-center">
                <h4 className="mb-6 text-xl font-semibold tracking-tight">
                  Gratis
                </h4>
                <h3>
                  <span className="text-lg font-semibold tracking-tight">
                    NOK
                  </span>
                  <span className="text-5xl tracking-tighter font-heading md:text-6xl">
                    0,
                  </span>
                </h3>
                <span className="inline-block mt-2 tracking-tight mb-5">
                  per måned
                </span>
                <div className="py-6 border-t border-b border-gray-300 border-opacity-60">
                  <p className="max-w-xs mx-auto tracking-tight">
                    Alt du trenger for å booke møterommet ditt.
                  </p>
                </div>
                <ul className="py-6">
                  <li className="flex flex-wrap items-center mb-2">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">Enkle Funksjoner</span>
                  </li>
                  <li className="flex flex-wrap items-center mb-2">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="mr-2 font-medium">1 Administrator</span>
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.75 10.9951H8V7.99512H7.25M8 4.99512H8.0075M14.75 7.99512C14.75 11.723 11.7279 14.7451 8 14.7451C4.27208 14.7451 1.25 11.723 1.25 7.99512C1.25 4.26719 4.27208 1.24512 8 1.24512C11.7279 1.24512 14.75 4.26719 14.75 7.99512Z"
                        stroke="#7F8995"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </li>
                  <li className="flex flex-wrap items-center mb-2">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="mr-2 font-medium">10 Brukere</span>
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.75 10.9951H8V7.99512H7.25M8 4.99512H8.0075M14.75 7.99512C14.75 11.723 11.7279 14.7451 8 14.7451C4.27208 14.7451 1.25 11.723 1.25 7.99512C1.25 4.26719 4.27208 1.24512 8 1.24512C11.7279 1.24512 14.75 4.26719 14.75 7.99512Z"
                        stroke="#7F8995"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </li>
                  <li className="flex flex-wrap items-center mb-2">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">1 Møterom</span>
                  </li>
                  <li className="flex flex-wrap items-center">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">Begrenset Kundestøtte</span>
                  </li>
                </ul>
                {!currentUser && (
                  <Link
                    className="inline-block w-full px-5 py-4 font-semibold tracking-tight text-center text-white transition duration-200 border rounded-lg cursor-pointer hover:text-white bg-secondary hover:bg-primary border-primary focus:ring-4 focus:ring-light"
                    href="/signup"
                  >
                    Kom i gang
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="w-full p-4 md:w-1/2 lg:w-1/3 max-w-sm">
            <div className="relative p-6 transition duration-500 transform bg-white rounded-lg hover:-translate-y-2">
              <Image
                className="absolute z-10 hidden md:block -top-32 right-8"
                src="/best-verdi.png"
                alt=""
                height="94"
                width="171"
              />
              <div
                className="absolute left-0 w-full -top-10 rounded-t-xl"
                style={{
                  background: 'url("/gradient.png")',
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <p className="py-2 font-semibold tracking-tight text-center text-white">
                  Anbefalt
                </p>
              </div>
              <div className="text-center">
                <h4 className="mb-6 text-xl font-semibold tracking-tight">
                  Standard
                </h4>
                <h3>
                  <span className="text-lg font-semibold tracking-tight">
                    NOK
                  </span>
                  <span className="text-5xl tracking-tighter font-heading md:text-6xl">
                    &nbsp;49,-
                  </span>
                </h3>
                <span className="inline-block mt-2 tracking-tight mb-5">
                  per måned
                </span>
                <div className="py-8 border-t border-b border-gray-300 border-opacity-60">
                  <p className="max-w-xs mx-auto tracking-tight">
                    Perfekt for litt større firma og de som ønsker støtte
                    prosjektet
                  </p>
                </div>
                <ul className="py-8">
                  <li className="flex flex-wrap items-center mb-2">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">Avanserte Funksjoner</span>
                  </li>
                  <li className="flex flex-wrap items-center mb-2">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="mr-2 font-medium">1 Administrator</span>
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.75 10.9951H8V7.99512H7.25M8 4.99512H8.0075M14.75 7.99512C14.75 11.723 11.7279 14.7451 8 14.7451C4.27208 14.7451 1.25 11.723 1.25 7.99512C1.25 4.26719 4.27208 1.24512 8 1.24512C11.7279 1.24512 14.75 4.26719 14.75 7.99512Z"
                        stroke="#7F8995"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </li>
                  <li className="flex flex-wrap items-center mb-2">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="mr-2 font-medium">25 Brukere</span>
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.75 10.9951H8V7.99512H7.25M8 4.99512H8.0075M14.75 7.99512C14.75 11.723 11.7279 14.7451 8 14.7451C4.27208 14.7451 1.25 11.723 1.25 7.99512C1.25 4.26719 4.27208 1.24512 8 1.24512C11.7279 1.24512 14.75 4.26719 14.75 7.99512Z"
                        stroke="#7F8995"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </li>
                  <li className="flex flex-wrap items-center mb-2">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">Ubegrenset Møterom</span>
                  </li>
                  <li className="flex flex-wrap items-center">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">Full Kundestøtte</span>
                  </li>
                </ul>
                {!currentUser && (
                  <Link
                    className="inline-block w-full px-5 py-4 font-semibold tracking-tight text-center text-white transition duration-200 border rounded-lg cursor-pointer hover:text-white bg-primary hover:bg-dark border-secondary focus:ring-4 focus:ring-dark"
                    href="/signup"
                  >
                    Kom i gang
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="w-full p-4 md:w-1/2 lg:w-1/3 max-w-sm">
            <div className="p-6 transition duration-500 transform bg-white rounded-lg hover:-translate-y-2">
              <div className="text-center">
                <h4 className="mb-6 text-xl font-semibold tracking-tight">
                  Tilpasset
                </h4>
                <h3>
                  <span className="text-lg font-semibold tracking-tight">
                    NOK
                  </span>
                  <span className="text-5xl tracking-tighter font-heading md:text-6xl">
                    &nbsp;99,-
                  </span>
                </h3>
                <span className="inline-block tracking-tight mb-7">
                  per måned
                </span>
                <div className="py-8 border-t border-b border-gray-300 border-opacity-60">
                  <p className="max-w-xs mx-auto tracking-tight">
                    Kontakt oss for tilpasset tilbud, eventuelt deres ønsker og
                    krav.
                  </p>
                </div>
                <ul className="py-8">
                  <li className="flex flex-wrap items-center mb-2">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">Avanserte Funksjoner</span>
                  </li>
                  <li className="flex flex-wrap items-center mb-2">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="mr-2 font-medium">
                      Ubegrenset Administratorer
                    </span>
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.75 10.9951H8V7.99512H7.25M8 4.99512H8.0075M14.75 7.99512C14.75 11.723 11.7279 14.7451 8 14.7451C4.27208 14.7451 1.25 11.723 1.25 7.99512C1.25 4.26719 4.27208 1.24512 8 1.24512C11.7279 1.24512 14.75 4.26719 14.75 7.99512Z"
                        stroke="#7F8995"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </li>
                  <li className="flex flex-wrap items-center mb-2">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="mr-2 font-medium">Ubegrenset Brukere</span>
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.75 10.9951H8V7.99512H7.25M8 4.99512H8.0075M14.75 7.99512C14.75 11.723 11.7279 14.7451 8 14.7451C4.27208 14.7451 1.25 11.723 1.25 7.99512C1.25 4.26719 4.27208 1.24512 8 1.24512C11.7279 1.24512 14.75 4.26719 14.75 7.99512Z"
                        stroke="#7F8995"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </li>
                  <li className="flex flex-wrap items-center mb-2">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">Ubegrenset Møterom</span>
                  </li>
                  <li className="flex flex-wrap items-center">
                    <svg
                      className="mr-4"
                      width={14}
                      height={12}
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16797 6.82813L4.5013 10.1615L12.8346 1.82812"
                        stroke="#5E27FF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">Full Kundestøtte</span>
                  </li>
                </ul>
                <a
                  className="inline-block w-full px-5 py-4 font-semibold tracking-tight text-center text-white transition duration-200 border rounded-lg hover:text-white bg-dark hover:bg-secondary border-secondary focus:ring-4 focus:ring-primary"
                  href="mailto:mads@rosario.no"
                >
                  Kontakt oss
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
