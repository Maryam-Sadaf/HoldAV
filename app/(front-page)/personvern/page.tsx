import Informasjonskapsel from "@/components/Sections/Informasjonskapsel";
import Personvern from "@/components/Sections/Personvern";
import Footer from "@/components/Sections/Footer";
import Navbar from "@/components/Sections/Navbar";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="w-full min-h-screen">
      <Navbar currentUser={false} />
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full max-w-[1280px] py-10 lg:py-20  px-4">
          <h1 className="text-3xl font-medium leading-loose">
            Personvern og Informasjonskapsler
          </h1>
          <p className="py-2 text-gray-400">
            Velkommen til personvern- og informasjonskapselsiden for HOLD AV
            (heretter referert til som &quot;vi&quot;, &quot;oss&quot;,
            &quot;HOLD AV&quot;). Vi verdsetter ditt personvern og ønsker å
            sikre at du er fullt informert om hvordan vi håndterer dine
            personopplysninger og bruker informasjonskapsler når du besøker vår
            nettside www.holdav.no (heretter referert til som
            &quot;Nettsiden&quot;).
          </p>
          <p className="py-2 pt-8 text-xl font-medium">Personvern</p>
          <p className="py-2 text-gray-400">
            Vi behandler personopplysninger i samsvar med gjeldende
            personvernlovgivning. Vennligst les vår{" "}
            <Link
              className="font-medium cursor-pointer text-main"
              href="/personvern/personvernserklaering"
            >
              Personvernerklæring
            </Link>
            &nbsp; for å få innsikt i hvordan vi samler inn, behandler og deler
            dine personopplysninger.
          </p>

          <p className="py-2 pt-8 text-xl font-medium">
            Informasjonskapsler (Cookies)
          </p>
          <p className="py-2 text-gray-400">
            For å forbedre din opplevelse på Nettsiden bruker vi
            informasjonskapsler. Informasjonskapsler er små tekstfiler som
            lagres på din enhet når du besøker en nettside. Vår&nbsp;
            <Link
              className="font-medium cursor-pointer text-main"
              href="/personvern/informasjonskapselpolicy"
            >
              Informasjonskapselpolicy
            </Link>
            &nbsp; gir detaljert informasjon om hvilke informasjonskapsler vi
            bruker, hvordan de brukes, og hvordan du kan administrere dem.
          </p>
          <p className="py-2 pt-8 text-xl font-medium">Samtykke</p>
          <p className="py-2 text-gray-400">
            Ved å bruke Nettsiden, samtykker du til vår behandling av
            personopplysninger og bruk av informasjonskapsler i samsvar med
            denne personvern- og informasjonskapselsiden. Dersom du ikke
            samtykker, ber vi deg vennligst om å unngå å bruke Nettsiden.
          </p>
          <p className="py-2 pt-8 text-xl font-medium">Samtykke</p>
          <p className="py-2 text-gray-400">
            Ved å bruke Nettsiden, samtykker du til vår behandling av
            personopplysninger og bruk av informasjonskapsler i samsvar med
            denne personvern- og informasjonskapselsiden. Dersom du ikke
            samtykker, ber vi deg vennligst om å unngå å bruke Nettsiden.
          </p>
          <p className="py-2 pt-8 text-xl font-medium">Kontakt Oss</p>
          <p className="py-2 text-gray-400">
            Hvis du har spørsmål eller bekymringer angående personvern eller
            informasjonskapsler, vennligst kontakt oss via support på bunnen av
            siden.
            <br />
            <br />
            Denne siden ble sist oppdatert 12.01.2024
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
