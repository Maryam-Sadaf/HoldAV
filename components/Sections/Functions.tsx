import Image from "next/image";
import Link from "next/link";
import React from "react";

interface FunctionsProps {
  currentUser?: any | null;
}

const Functions = ({ currentUser }: FunctionsProps) => {
  return (
    <section id="functions" className="w-full py-24 overflow-hidden bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-xl mx-auto mb-20 text-center">
          <h2 className="mb-5 text-6xl tracking-tighter font-heading">
            Kom i gang i dag!
          </h2>
          <p className="text-xl tracking-tight">
            Ta det første skrittet mot en enklere og mer effektiv måte å booke
            møterom på.
          </p>
        </div>
        <div className="flex flex-wrap -m-7 mb-14">
          <div className="w-full md:w-1/3 p-7">
            <div className="max-w-xs">
              <Image
                className="mb-10"
                src="/midl/tool.svg"
                alt="Tool icon"
                height={64}
                width={64}
                sizes="64px"
              />
              <h3 className="mb-4 text-xl font-semibold tracking-tight">
                Enkel Booking i Farta
              </h3>
              <p className="tracking-tight text-gray-600">
                Den responsive og brukervennlige plattformen gjør det enkelt å
                foreta reservasjoner når som helst og hvor som helst, slik at du
                alltid er i kontroll over timeplanen din. Enten du er på
                kontoret, hjemme eller på farten.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-7">
            <div className="max-w-xs">
              <Image
                className="mb-10"
                src="/midl/account.svg"
                alt="Account icon"
                height={64}
                width={64}
                sizes="64px"
              />
              <h3 className="mb-4 text-xl font-semibold tracking-tight">
                Tidsbesparende Bookingprosess
              </h3>
              <p className="tracking-tight text-gray-600">
                Den enkle og effektive reservasjonsprosessen gjør at du kan
                fokusere på det viktige – selve møtet – og ikke kaste bort tid
                på administrative detaljer.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-7">
            <div className="max-w-xs">
              <Image
                className="mb-10"
                src="/midl/start.svg"
                alt="Start icon"
                height={64}
                width={64}
                sizes="64px"
              />
              <h3 className="mb-4 text-xl font-semibold tracking-tight">
                Øyeblikkelig Oversikt
              </h3>
              <p className="tracking-tight text-gray-600">
                Med HOLD AV kan du raskt og enkelt se tilgjengeligheten til
                møterommet ditt. Den intuitive kalenderen gir deg en
                øyeblikkelig oversikt over ledige og opptatte tidsintervaller,
                slik at du kan planlegge møtet ditt uten tidsspille.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          {!currentUser && (
            <Link
              className="inline-block px-5 py-4 mx-auto font-semibold tracking-tight text-white transition duration-200 rounded-lg bg-primary hover:bg-secondary focus:ring-4 focus:ring-indigo-300"
              href="/signup"
            >
              Kom i gang
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Functions;
