import React from "react";

const Personvern = () => {
  return (
    <div id="personvernserklaering">
      <h1 className="text-3xl font-medium leading-loose">
        Personvernserklæring for HOLD AV
      </h1>
      <p className="py-2 text-gray-400">
        Sist oppdatert: 12.01.2024
        <br />
        <br />
        Vi i [Ditt Bedriftsnavn] (heretter referert til som &quot;vi&quot;,
        &quot;oss&quot;, &quot;HOLD AV&quot;) forstår viktigheten av personvern
        og er dedikert til å beskytte dine personopplysninger. Denne
        personvernserklæringen forklarer hvordan vi samler inn, bruker, deler og
        beskytter dine personopplysninger når du bruker vår tjeneste HOLD AV,
        tilgjengelig på www.holdav.no (heretter referert til som
        &quot;Nettsiden&quot;).
      </p>
      <p className="text-xl pt-8 py-2 font-medium">
        Hva slags informasjon samler vi inn?
      </p>
      <p className="py-2 text-gray-400">
        Vi samler inn følgende typer personopplysninger når du bruker HOLD AV:
      </p>
      <ul className="py-2 text-gray-400 list-disc list-inside">
        <li>
          <span className="font-bold">Kontaktinformasjon:</span> Navn
          (valgfritt) og e-postadresse.
        </li>
        <li>
          <span className="font-bold">Brukerinformasjon:</span> Informasjon
          knyttet til din bruk av tjenesten, inkludert brukernavn og kryptert
          passord.
        </li>
        <li>
          <span className="font-bold">Teknisk informasjon:</span> Vi samler ikke
          inn IP-adresse, enhetstype, nettleserinformasjon, og annen lignende
          teknisk informasjon.
        </li>
      </ul>
      <p className="text-xl pt-8 py-2 font-medium">
        Hvordan bruker vi informasjonen?
      </p>
      <p className="py-2 text-gray-400">
        Vi bruker innsamlet informasjon for følgende formål:
      </p>
      <ul className="py-2 text-gray-400 list-disc list-inside">
        <li>
          <span className="font-bold">Tjenesteleveranse:</span> For å tilby og
          administrere HOLD AV-tjenesten, inkludert håndtering av
          romreservasjoner og annen funksjonalitet.
        </li>
        <li>
          <span className="font-bold">Kommunikasjon:</span> For å kontakte deg
          angående din konto, tjenesten og relevante oppdateringer.
        </li>
        <li>
          <span className="font-bold">Forbedring av tjenesten:</span> For å
          analysere bruksmønstre, feilsøke og forbedre HOLD AV-tjenesten.
        </li>
        <li>
          <span className="font-bold">Overholdelse av lover:</span> For å
          overholde gjeldende lover og reguleringer.
        </li>
      </ul>

      <p className="text-xl pt-8 py-2 font-medium">
        Hvordan deler vi informasjonen?
      </p>
      <p className="py-2 text-gray-400">
        Vi deler ikke dine personopplysninger med tredjeparter uten ditt
        samtykke, med mindre det er nødvendig for å oppfylle juridiske
        forpliktelser eller for å levere tjenesten.
      </p>
      <p className="text-xl pt-8 py-2 font-medium">
        Informasjonskapsler og lignende teknologier
      </p>
      <p className="py-2 text-gray-400">
        Nettsiden bruker informasjonskapsler og lignende teknologier for å
        forbedre din brukeropplevelse. For mer informasjon, vennligst se vår
        Informasjonskapselpolicy.
      </p>
      <p className="text-xl pt-8 py-2 font-medium">Dine rettigheter</p>
      <p className="py-2 text-gray-400">
        Du har rett til å få tilgang til, korrigere, slette og protestere mot
        bruken av dine personopplysninger. For å utøve disse rettighetene eller
        for ytterligere spørsmål, vennligst kontakt oss via support på bunnen av
        siden.
      </p>
      <p className="text-xl pt-8 py-2 font-medium">
        Endringer i personvernserklæringen
      </p>
      <p className="py-2 text-gray-400">
        Vi forbeholder oss retten til å oppdatere denne personvernserklæringen
        når som helst. Eventuelle endringer vil bli publisert på Nettsiden, og
        datoen for siste oppdatering vil bli endret øverst i erklæringen.
        <br /> <br />
        Vi oppfordrer deg til å gjennomgå denne personvernserklæringen
        regelmessig for å holde deg informert om hvordan vi beskytter dine
        personopplysninger.
      </p>
      <p className="text-xl pt-8 py-2 font-medium">Kontaktinformasjon</p>
      <p className="py-2 text-gray-400">
        Hvis du har spørsmål eller bekymringer angående vår håndtering av
        personopplysninger, vennligst kontakt oss via support på bunnen av siden
      </p>
    </div>
  );
};

export default Personvern;
