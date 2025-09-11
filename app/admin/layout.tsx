import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import getCurrentUser from "../server/actions/getCurrentUser";
import EmptyState from "@/components/EmptyState";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session: any = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const currentUser = session.user;

  if (!currentUser) {
    return (
      <EmptyState
        title="Uautorisert"
        subTitle="Uautorisert, vennligst logg inn "
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="fixed inset-y-0 left-0 z-50 w-full md:w-[250px] md:relative md:flex md:flex-col">
        <Sidebar currentUser={currentUser} />
      </div>
      <main className="flex-1 overflow-auto px-3 py-10 md:py-20">
        {/*<Navbar user currentUser={currentUser} />*/}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
