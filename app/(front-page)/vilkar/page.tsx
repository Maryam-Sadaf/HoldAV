import Footer from "@/components/Sections/Footer";
import Navbar from "@/components/Sections/Navbar";
import React from "react";

const page = () => {
  return (
    <div className="w-full min-h-screen">
      <Navbar currentUser={false} />
      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-[1280px] py-10 lg:py-20 px-4">
          <h1 className="text-3xl font-medium leading-loose">Vilkår</h1>
          <p className="py-2 text-gray-400">
            Disse vilkårene gjelder for tjenesten HOLD AV, levert av ROSARIO
            (Leverandøren), og kunden som har inngått en avtale om bruk av HOLD
            AV.
            <br />
            Ved å bruke HOLD AV godtar du disse vilkårene på vegne av foretaket
            du er registrert med.
          </p>
          <p className="py-2 pt-8 text-xl font-medium">Kundekrav</p>
          <ul className="py-2 text-gray-400 list-disc list-inside">
            <li>
              Kun foretak med et gyldig organisasjonsnummer kan bli kunde hos
              HOLD AV.
            </li>
            <li>Privatpersoner kan ikke bli kunde.</li>
          </ul>
          <p className="py-2 pt-8 text-xl font-medium">Definisjoner</p>
          <ul className="py-2 text-gray-400 list-disc list-inside">
            <li>“Kunden” betyr foretaket som er registrert hos HOLD AV.</li>
            <li>
              “Bruker” betyr de personene som har en brukerkonto knyttet til
              foretakets konto hos HOLD AV.
            </li>
            <li>
              “Vi”, “oss” og “Leverandøren” betyr ROSARIO som
              tjenesteleverandør.
            </li>
            <li>
              “HOLD AV” betyr vår tjeneste tilgjengelig som web-applikasjon på
              holdav.no og dets underdomener.
            </li>
            <li>
              “Tjenesten” / “tjenester” betyr den tjenesten som er beskrevet
              over.
            </li>
            <li>“Nettside” betyr vår nettside på www.holdav.no.</li>
          </ul>
          <p className="py-2 pt-8 text-xl font-medium">Lisenser</p>
          <ul className="py-2 text-gray-400 list-disc list-inside">
            <li>Lisenser gir foretaket tilgang til å benytte HOLD AV.</li>
            <li>
              Lisenser betales på forskudd for en periode på 1 måned av gangen.
            </li>
            <li>
              Lisenser kan også betales på forskudd for en periode på 12
              måneder.
            </li>
            <li>Bestilte lisenser refunderes ikke.</li>
          </ul>
          <p className="py-2 pt-8 text-xl font-medium">Kundens forpliktelser</p>
          <ul className="py-2 text-gray-400 list-disc list-inside">
            <li>
              Kunden forplikter seg til å oppbevare brukernavn og passord godt
              sikret for å forhindre ubegrunnet tilgang.
            </li>
            <li>
              Kunden skal varsle Leverandøren om endringer i viktig informasjon,
              inkludert firmanavn, adresse, telefonnummer, e-post og
              kontaktperson.
            </li>
          </ul>
          <p className="py-2 pt-8 text-xl font-medium">Oppsigelse</p>
          <ul className="py-2 text-gray-400 list-disc list-inside">
            <li>
              Kunden sier opp avtalen ved å deaktivere fornyelse inne i
              tjenesten.
            </li>
            <li>Lisensene forblir gyldige til hovedforfall.</li>
            <li>
              Lisenser fornyes automatisk ved hovedforfall dersom fornyelse ikke
              er skrudd av.
            </li>
          </ul>
          <p className="py-2 pt-8 text-xl font-medium">
            Forhold for oppsigelse fra Leverandørens side
          </p>
          <p className="py-2 text-gray-400">
            Leverandøren kan si opp avtalen dersom:
          </p>
          <ul className="py-2 text-gray-400 list-disc list-inside">
            <li>Bruken strider mot norsk lovgivning.</li>
            <li>Bruken strider mot denne avtalen.</li>
            <li>Bruken fører til forstyrrelser på Leverandørens systemer.</li>
          </ul>
          <p className="py-2 pt-8 text-xl font-medium">Personvern</p>

          <ul className="py-2 text-gray-400 list-disc list-inside">
            <li>
              Leverandør vil kunne behandle personopplysninger på vegne av
              kunden som følge av at kunden og kundens brukere benytter
              tjenesten.
            </li>
            <li>
              Leverandør vil i den forbindelse opptre som databehandler for
              kunden etter personopplysningsloven.
            </li>
            <li>
              Kunden er behandlingsansvarlig etter loven og har full rådighet
              over personopplysninger kunden behandler gjennom tjenesten.
            </li>
          </ul>
          <p className="py-2 pt-8 text-xl font-medium">Backup</p>

          <ul className="py-2 text-gray-400 list-disc list-inside">
            <li>
              Det tas ikke regelmessig backup av alle data som lagres ved bruk
              av tjenesten. Men kan avtales direkte.
            </li>
            <li>
              Kunden har ikke krav på erstatning eller tilbakebetaling som følge
              av tap av data.
            </li>
            <li>
              Gjenoppretting av data fra sikkerhetskopi kan belastes kunden
              etter medgått tid.
            </li>
          </ul>
          <p className="py-2 pt-8 text-xl font-medium">Erstatning</p>

          <ul className="py-2 text-gray-400 list-disc list-inside">
            <li>
              Leverandør er ikke under noen omstendigheter erstatningspliktig
              for tap av omsetning eller tap av data som følger av feil eller
              mangler ved tjenesten og leveransen.
            </li>
          </ul>
          <p className="py-2 pt-8 text-xl font-medium">Force majeure</p>

          <ul className="py-2 text-gray-400 list-disc list-inside">
            <li>
              Dersom en ekstraordinær situasjon oppstår, fritas partene fra
              avtalen i den perioden situasjonen varer.
            </li>
            <li>
              Slike forhold inkluderer, men er ikke begrenset til, streik,
              lockout, linjefeil hos linjeleverandør, krig, naturkatastrofer
              eller ethvert annet forhold som regnes som force majeure.
            </li>
          </ul>
          <p className="py-2 pt-8 text-xl font-medium">
            Lovvalg og tvisteløsning
          </p>

          <ul className="py-2 text-gray-400 list-disc list-inside">
            <li>
              Leverandør godtar Agder Tingrett som rett verneting for enhver
              tvist som springer ut av denne avtalen.
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
