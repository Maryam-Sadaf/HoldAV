import { redirect } from "next/navigation";

interface IParams {
  companyName: string;
  userId: string;
}

const AdminHomePage = async ({ params }: { params: Promise<IParams> }) => {
  const { companyName, userId } = await params;
  
  // Redirect to the main admin dashboard
  redirect(`/admin/${companyName}/${userId}`);
};

export default AdminHomePage;
