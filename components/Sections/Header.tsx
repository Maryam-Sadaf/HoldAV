import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HeaderProps {
  currentUser?: any | null;
}

const Header = ({ currentUser }: HeaderProps) => {
  return (
    <section id="hjem" className="w-full overflow-hidden">
      <div className="pt-16 overflow-hidden bg-white pb-28">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="mb-4 text-6xl tracking-tighter font-heading md:text-7xl">
              Enklere og mer effektiv Møteromsbooking
            </h1>
            <p className="max-w-md mx-auto mb-10">
              Velkommen til HOLD AV - det intuitive bookingsystemet som tar bort
              stresset fra romreservasjoner, helt gratis!
            </p>
            {!currentUser && (
              <Link
                className="inline-block px-5 py-4 mb-6 font-semibold tracking-tight text-white transition duration-200 rounded-lg bg-primary hover:bg-secondary focus:ring-4 focus:ring-indigo-300"
                href="/signup"
              >
                Kom i gang
              </Link>
            )}
            {/*<p className="mb-20 text-sm tracking-tight text-gray-600">
              No Credit Card Required / Cancel Anytime
  </p>*/}
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center">
              <div className="relative z-10 flex-1">
                <div
                  className="rounded-full"
                  style={{
                    background: 'url("/bg-gradient.png")',
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="w-auto mx-auto">
                      <div className="relative w-56 py-8 text-center">
                        <h2 className="mb-3 font-semibold tracking-tighter text-white text-7xl">
                          kr 0,-
                        </h2>
                        <h3 className="mb-3 text-2xl font-semibold text-white">
                          Helt kostnadsfritt
                        </h3>
                        <p className="font-medium text-white">
                          Ingen skjulte kostnader
                        </p>
                        <svg
                          className="absolute top-0 -right-16"
                          width={48}
                          height={29}
                          viewBox="0 0 48 29"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M46.9768 3.48213C41.8293 0.969009 36.4787 0.900369 35.2041 1.6363C32.1879 3.37769 31.3644 5.04466 29.5283 8.4754C28.4845 10.4255 27.5211 14.1488 26.0573 15.56C23.9487 17.5928 22.6869 18.5625 19.5593 18.5658C16.5467 18.569 10.9507 15.639 7.3183 17.7362C3.6859 19.8333 3.38771 26.3985 1.76915 27.333"
                            stroke="white"
                            strokeWidth={2}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="w-auto mx-auto xl:-mr-px">
                      <Image
                        className="relative transition duration-500 transform -right-px hover:translate-x-5"
                        src="/headerimage.png"
                        alt="Hold Av hero"
                        height={299}
                        width={582}
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 582px"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-auto -ml-8">
                <Image
                  className="rounded-full"
                  src="/headerimage_meeting.png"
                  alt="Meeting"
                  height={262}
                  width={266}
                  sizes="(max-width: 768px) 160px, 266px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
