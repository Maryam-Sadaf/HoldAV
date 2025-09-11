import Image from "next/image";
import React from "react";

const MainFocus = () => {
  return (
    <section className="w-full py-24 overflow-hidden lg:py-40">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center -m-8">
          <div className="w-full p-8 md:w-1/2">
            <div className="mx-auto max-w-max">
              <Image
                className="transition duration-500 transform hover:-translate-y-2"
                src="/booking-illustrasjon.png"
                alt="Booking illustrasjon"
                height={443}
                width={443}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 443px"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDqvTzfg6HzlEY4RBEjEJcAJOaIvAVm0TZp5I6kz8RRB5r9e1/9k="
              />
            </div>
          </div>
          <div className="w-full p-8 md:w-1/2">
            <div className="md:max-w-md">
              <div className="flex flex-wrap -m-6">
                <div className="w-auto p-6">
                  <h3
                    className="mb-4 text-3xl font-semibold tracking-tighter"
                    style={{ letterSpacing: "-0.5px" }}
                  >
                    Enkelt
                  </h3>
                  <p className="tracking-tight">
                    HOLD AV er et brukervennlig bookingsystem designet for å
                    forenkle prosessen med å reservere møterom, konferanserom og
                    mer.
                  </p>
                </div>
                <div className="w-auto p-6">
                  <h3
                    className="mb-4 text-3xl font-semibold tracking-tighter"
                    style={{ letterSpacing: "-0.5px" }}
                  >
                    Oversiktlig
                  </h3>
                  <p className="tracking-tight">
                    Med HOLD AV kan du effektivt organisere møterom,
                    konferanserom og mer uten kostnader.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainFocus;
