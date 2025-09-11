import Container from "@/components/Container";
import Heading from "@/components/Heading";
import React from "react";
import SlugClient from "./SlugClinet";
import getCurrentUser from "@/app/server/actions/getCurrentUser";
import getUserById from "@/app/server/actions/getUserById";

interface IParams {
  userId?: string;
}

const Slug = async ({ params }: { params: Promise<IParams> }) => {
  const currentUser = await getCurrentUser();
  const { userId } = await params;

  const userById = await getUserById({ userId: userId });

  return (
    <Container>
      <div>
        <Heading title="Legg til møterom" />
      </div>
      <div>
        <SlugClient currentUser={currentUser} userById={userById} />
      </div>
    </Container>
  );
};

export default Slug;
