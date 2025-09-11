import getCurrentUser from "@/app/server/actions/getCurrentUser";
import BrukerClient from "./BrukerClient";
import Heading from "@/components/Heading";
import EmptyState from "@/components/EmptyState";
import Container from "@/components/Container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

interface IParams {
  companyName: string;
  userId: string;
}

const BrukerPage = async ({ params }: { params?: IParams }) => {
  const session: any = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const currentUser = session.user;
  if (currentUser?.role !== "admin") {
    return (
      <EmptyState
        title="Uautorisert"
        subTitle="Uautorisert, kun for administrator"
      />
    );
  }
  return (
    <Container>
      <div>
        <Heading
          title="Opprett ny bruker"
          subTitle="Her kan du opprette brukere på forhånd."
        />
      </div>
      <BrukerClient currentUser={currentUser} />
    </Container>
  );
};

export default BrukerPage;
