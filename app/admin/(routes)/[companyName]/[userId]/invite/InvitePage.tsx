import Container from "@/components/Container";
import Heading from "@/components/Heading";
import React from "react";
import getUserById from "@/app/server/actions/getUserById";
import InvitePageClient from "./InvitePageClient";
import EmptyState from "@/components/EmptyState";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

interface IParams {
  userId?: string;
  companyName?: string;
}

const InvitePage = async ({ params }: { params: Promise<IParams> }) => {
  const session: any = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const currentUser = session.user;
  const { userId, companyName } = await params;

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
        <Heading title="Inviter nye brukere" />
      </div>
      <div>
        <InvitePageClient currentUser={currentUser} companyName={companyName} />
      </div>
    </Container>
  );
};

export default InvitePage;
