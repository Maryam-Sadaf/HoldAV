import getCurrentUser from "@/app/server/actions/getCurrentUser";
import CallBackClient from "./CallBackClient";

const Callback = async () => {
  const currentUser = await getCurrentUser();
  return <CallBackClient currentUser={currentUser} />;
};

export default Callback;
