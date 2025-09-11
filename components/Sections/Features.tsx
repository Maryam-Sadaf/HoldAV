import Image from "next/image";
import React from "react";

const Features = () => {
  return (
    <section id="funksjoner" className="py-24 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap -m-8">
          <div className="w-full md:w-1/3 p-8">
            <div className="flex flex-wrap -m-1.5">
              <div className="w-auto p-1.5 mr-2">
                <Image
                  src="/tidsbesparende.png"
                  alt="Tidsbesparende"
                  width={74}
                  height={74}
                  sizes="74px"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 p-1.5">
                <p className="text-xl font-medium tracking-tight">
                  Tidsbesparende: Ingen tidkrevende prosesser – reserver rom på
                  et blunk.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-8">
            <div className="flex flex-wrap -m-1.5">
              <div className="w-auto p-1.5 mr-2">
                <Image src="/enkelt.png" alt="Enkelt" width={74} height={74} sizes="74px" loading="lazy" />
              </div>
              <div className="flex-1 p-1.5">
                <p className="text-xl font-medium tracking-tight">
                  Intuitivt grensesnitt: Brukervennlig design for enkel
                  navigasjon.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-8">
            <div className="flex flex-wrap -m-1.5">
              <div className="w-auto p-1.5 mr-2">
                <Image src="/gratis.png" alt="Gratis" width={74} height={74} sizes="74px" />
              </div>
              <div className="flex-1 p-1.5">
                <p className="text-xl font-medium tracking-tight">
                  Gratis og Uforpliktende: HOLD AV koster 0,- kr – ingen skjulte
                  kostnader.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
