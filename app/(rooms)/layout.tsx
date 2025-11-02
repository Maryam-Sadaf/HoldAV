import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="w-full md:w-[250px] md:relative md:flex md:flex-col shrink-0">
        <Sidebar currentUser={currentUser} />
      </div>
      <main className="flex-1 overflow-auto px-2 py-4 md:px-0 md:py-10">
        {/*<Navbar user currentUser={currentUser} />*/}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
