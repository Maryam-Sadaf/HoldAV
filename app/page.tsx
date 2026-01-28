import Navbar from "@/components/Sections/Navbar";
import { getRoutesByCurrentUser } from "./server/actions/getRoutesByCurrentUser";
import getCurrentUser from "./server/actions/getCurrentUser";
import getRoomsByCompanyName from "./server/actions/getRoomsByCompanyName";
import Link from "next/link";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import Header from "@/components/Sections/Header";
import Bar from "./Bar";
import { roomNameToSlug, companyNameToSlug, formatRoomNameForDisplay } from "@/utils/slugUtils";
import dynamic from "next/dynamic";

// Performance: Optimized dynamic imports for better loading
const Features = dynamic(() => import("@/components/Sections/Features"), { 
  loading: () => <div className="h-48 bg-gray-50 animate-pulse rounded-lg"></div>
});
const MainFocus = dynamic(() => import("@/components/Sections/MainFocus"), { 
  loading: () => <div className="h-64 bg-gray-50 animate-pulse rounded-lg"></div>
});
const Functions = dynamic(() => import("@/components/Sections/Functions"), { 
  loading: () => <div className="h-72 bg-gray-50 animate-pulse rounded-lg"></div>
});
const Integrations = dynamic(() => import("@/components/Sections/Integrations"), { 
  loading: () => <div className="h-48 bg-gray-50 animate-pulse rounded-lg"></div>
});
const Pricing = dynamic(() => import("@/components/Sections/Pricing"), { 
  loading: () => <div className="h-96 bg-gray-50 animate-pulse rounded-lg"></div>
});
const Footer = dynamic(() => import("@/components/Sections/Footer"), { 
  loading: () => <div className="h-64 bg-gray-50 animate-pulse rounded-lg"></div>
});

export default async function Home() {
  // Get session first
  const session: any = await getServerSession(authOptions);
  const currentUser = session?.user;
  
  // Performance: Fetch data in parallel where possible
  let routes = null;
  let rooms = null;
  
  if (currentUser) {
    // First get routes
    routes = await getRoutesByCurrentUser({ userId: currentUser.id });
    
    // Then fetch rooms in parallel if we have company name
    const companyName = routes?.creator?.firmanavn || routes?.company?.firmanavn;
    if (companyName) {
      // This can be done in parallel with other operations
      rooms = await getRoomsByCompanyName({ companyName });
    }
  }
  
  return (
    <div>
      <div className="w-full bg-white">
        <div className="flex w-full max-w-[1400px] mx-auto bg-white">
          <Navbar currentUser={currentUser} />
          <Bar routes={routes} currentUser={currentUser} rooms={rooms} />
        </div>
      </div>

      {!rooms &&
        ""
        /*
        <div className="flex w-full text-white bg-primary">
          <p>
            Her var det ingenting... Kanskje firmaet ditt ikke har noen møterom?
          </p>
        </div>*/
      }
      {rooms && (
        <div className="flex w-full border-t border-b border-primary">
          {rooms?.length > 0 && (
            <div className="flex flex-row flex-wrap items-center justify-center w-full px-4 py-2 gap-x-8 gap-y-2">
              {rooms.map((room) => (
                <Link
                  href={`/${companyNameToSlug(
                    routes?.creator?.firmanavn || routes?.company?.firmanavn || ""
                  )}/${roomNameToSlug(room?.name || "")}`}
                  className="mx-auto mb-2"
                  prefetch={false}
                  key={room?.id} // Add a key to resolve React warnings
                >
                  <div className="flex justify-center px-4 py-2 font-bold text-center uppercase border-2 rounded text-primary border-primary">
                    {formatRoomNameForDisplay(room?.name)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <main className="flex flex-col items-center justify-start min-h-screen">
        <Header currentUser={currentUser} />
        <Features />
        <MainFocus />
        <Functions currentUser={currentUser} />
        <Integrations />
        {/*<Testimonials />*/}
        <Pricing currentUser={currentUser} />
        <Footer />
      </main>
    </div>
  );
}
