import Informasjonskapsel from "@/components/Sections/Informasjonskapsel";
import Footer from "@/components/Sections/Footer";
import Navbar from "@/components/Sections/Navbar";

import React from "react";

const page = () => {
  return (
    <div className="w-full min-h-screen">
      <Navbar currentUser={false} />
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full max-w-[1280px] py-10 lg:py-20 px-4">
          <Informasjonskapsel />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
