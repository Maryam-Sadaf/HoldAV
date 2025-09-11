import React from "react";
const Informasjonskapsel = () => {
  return (
    <div id="personvernserklaering">
      <h1 className="text-3xl font-medium leading-loose">
        Informasjonskapselpolicy for HOLD AV
      </h1>
      <p className="py-2 text-gray-400">
        Sist oppdatert: 12.01.2024
        <br />
        <br />
        Velkommen til Informasjonskapselpolicyen for HOLD AV. Denne policyen
        forklarer hvordan vi bruker informasjonskapsler og lignende teknologier
        når du besøker vår nettside www.holdav.no (heretter referert til som
        &quot;Nettsiden&quot;). Ved å bruke Nettsiden, samtykker du til vår bruk
        av informasjonskapsler i samsvar med denne policyen.
      </p>
      <p className="text-xl pt-8 py-2 font-medium">
        Hva er informasjonskapsler?
      </p>
      <p className="py-2 text-gray-400">
        Informasjonskapsler er små tekstfiler som lagres på din enhet når du
        besøker en nettside. Disse filene hjelper oss med å forbedre din
        opplevelse ved å lagre informasjon om dine preferanser, analyse av
        brukeratferd og tilpasse innholdet for å bedre imøtekomme dine behov.
      </p>

      <p className="text-xl pt-8 py-2 font-medium">
        Hvilke typer informasjonskapsler bruker vi?
      </p>
      <p className="py-2 text-gray-400">
        Vi bruker følgende typer informasjonskapsler på Nettsiden:
      </p>
      <ul className="py-2 text-gray-400 list-disc list-inside">
        <li>
          <span className="font-bold">Nødvendige informasjonskapsler:</span>
          &nbsp; Disse er avgjørende for at Nettsiden skal fungere ordentlig. De
          gjør det mulig for deg å navigere på Nettsiden og bruke dens
          funksjoner.
        </li>
        <li>
          <span className="font-bold">Analytiske informasjonskapsler:</span>
          &nbsp; Disse lar oss analysere hvordan besøkende samhandler med
          Nettsiden ved å samle inn og rapportere informasjon anonymt. Dette
          hjelper oss med å forstå og forbedre brukeropplevelsen.
        </li>
        {/*
        <li className="hidden">
          <span className="font-bold">Funksjonelle informasjonskapsler:</span>
          &nbsp; Disse brukes til å gjenkjenne deg når du returnerer til
          Nettsiden og lar oss tilpasse innholdet basert på dine preferanser.
        </li>
        */}
      </ul>

      <p className="text-xl pt-8 py-2 font-medium">
        Hvordan administrere informasjonskapsler?
      </p>
      <p className="py-2 text-gray-400">
        Du kan administrere preferansene dine for informasjonskapsler ved å
        endre innstillingene i nettleseren din. Vær oppmerksom på at begrensning
        av informasjonskapsler kan påvirke funksjonaliteten til Nettsiden.
      </p>
      <p className="text-xl pt-8 py-2 font-medium">
        Tredjeparts informasjonskapsler
      </p>
      <p className="py-2 text-gray-400">
        Vi bruker også tredjeparts tjenester som Google Analytics som kan
        installere informasjonskapsler på Nettsiden for å levere analyser om
        bruksmønstre. Disse informasjonskapslene er underlagt tredjeparts
        personvernregler.
      </p>
      <p className="text-xl pt-8 py-2 font-medium">
        Endringer i informasjonskapselpolicyen
      </p>
      <p className="py-2 text-gray-400">
        Vi forbeholder oss retten til å oppdatere denne
        informasjonskapselpolicyen når som helst. Eventuelle endringer vil bli
        publisert på Nettsiden, og datoen for siste oppdatering vil bli endret
        øverst i policyen.
        <br />
        <br />
        Vi oppfordrer deg til å gjennomgå denne informasjonskapselpolicyen
        regelmessig for å holde deg informert om hvordan vi bruker
        informasjonskapsler.
      </p>

      <p className="text-xl pt-8 py-2 font-medium">Kontaktinformasjon</p>
      <p className="py-2 text-gray-400">
        Hvis du har spørsmål eller bekymringer angående vår bruk av
        informasjonskapsler, vennligst kontakt oss via support på bunnen av
        siden
      </p>
    </div>
  );
};
export default Informasjonskapsel;
