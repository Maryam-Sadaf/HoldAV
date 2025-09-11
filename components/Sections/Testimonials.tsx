import Image from "next/image";
import React from "react";

const Testimonials = () => {
  return (
    <section
      id="omtaler"
      className="py-24 lg:pb-28 bg-gray-100 overflow-hidden w-full"
    >
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap xl:items-center -m-8">
          <div className="w-full md:w-1/2 p-8">
            <div className="md:max-w-md">
              <Image
                className="mb-6"
                src="/quote.png"
                alt=""
                width="37"
                height="31"
              />
              <h2
                className="mb-6 text-3xl font-semibold"
                style={{ letterSpacing: "-0.5px" }}
              >
                Superenkel booking, null kostnad, og jeg elsker at jeg kan gjøre
                det når som helst, hvor som helst. Anbefales på det sterkeste!
              </h2>
              <h3 className="mb-1 text-xl font-semibold tracking-tight">
                Kari Nordmann
              </h3>
              <span className="text-gray-600 tracking-tight">
                Administrasjonsleder, Logoipsum
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-8">
            <div className="flex flex-wrap justify-center -m-5 mb-12">
              <div className="w-auto p-5">
                <Image
                  src="/midl/brands/logo-dark6.svg"
                  height="50"
                  width="160"
                  alt=""
                />
              </div>
              <div className="w-auto p-5">
                <Image
                  src="/midl/brands/logo-dark5.svg"
                  height="50"
                  width="160"
                  alt=""
                />
              </div>
              <div className="w-auto p-5">
                <Image
                  src="/midl/brands/logo-dark4.svg"
                  height="50"
                  width="160"
                  alt=""
                />
              </div>
              <div className="w-auto p-5">
                <Image
                  src="/midl/brands/logo-dark3.svg"
                  height="50"
                  width="160"
                  alt=""
                />
              </div>
              <div className="w-auto p-5">
                <Image
                  src="/midl/brands/logo-dark2.svg"
                  height="50"
                  width="160"
                  alt=""
                />
              </div>
              <div className="w-auto p-5">
                <Image
                  src="/midl/brands/logo-dark.svg"
                  height="50"
                  width="160"
                  alt=""
                />
              </div>
            </div>
            <p className="text-gray-600 text-center tracking-tight">
              Bli med i en voksende gruppe fornøyde kunder som har byttet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
