import Image from "next/image";
import Link from "next/link";
import React from "react";

const Integrations = () => {
  return (
    <section
      id="integrasjoner"
      className="w-full pt-24 pb-20 overflow-hidden bg-white md:pt-36 md:pb-40"
    >
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center -m-8">
          <div className="w-full p-8 md:w-1/2">
            <div className="max-w-md">
              <h2 className="mb-4 text-6xl tracking-tighter font-heading">
                Mulige integrasjoner
              </h2>
              <p className="mb-10 text-xl">
                Ønsker du en sømløs opplevelse i din arbeidsflyt? Vi kan du
                tilpasse bookingsystemet etter dine behov og øke produktiviteten
                til en ny standard.
              </p>
              <a
                className="inline-block px-5 py-4 font-semibold tracking-tight text-white transition duration-200 rounded-lg bg-secondary hover:bg-primary focus:ring-4 focus:ring-indigo-400"
                href="mailto:mads@rosario.no"
              >
                Kontakt oss
              </a>
            </div>
          </div>
          <div className="w-full p-8 md:w-1/2">
            <div className="max-w-md mx-auto md:mr-0">
              <Image
                className="mb-2 ml-auto mr-6"
                src="/integrasjoner.png"
                alt=""
                height="91"
                width="180"
              />
              <div className="flex flex-wrap justify-center -m-9">
                <div className="w-auto p-9">
                  <Image
                    src="/outlook_calendar.svg"
                    alt="Outlook Calendar"
                    width={90}
                    height={90}
                    className="scale-110"
                    sizes="90px"
                  />
                </div>
                <div className="w-auto p-9">
                  <Image
                    src="/google_calendar.svg"
                    alt="Google Calendar"
                    width={90}
                    height={90}
                    sizes="90px"
                  />
                </div>
                <div className="w-auto p-9">
                  <Image
                    src="/midl/integrations/slack-xl.svg"
                    alt=""
                    className="grayscale"
                    width="90"
                    height="90"
                  />
                </div>
                <div className="w-auto p-9">
                  <Image
                    src="/midl/integrations/google-drive-xl.svg"
                    alt=""
                    className="grayscale"
                    width="90"
                    height="90"
                  />
                </div>
                <div className="w-auto p-9">
                  <Image
                    src="/google-calendar-icon.png"
                    alt=""
                    className="grayscale"
                    width="90"
                    height="90"
                  />
                </div>
                <div className="w-auto p-9">
                  <Image
                    src="/midl/integrations/brand2-xl.svg"
                    alt=""
                    className="grayscale"
                    width="90"
                    height="90"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
