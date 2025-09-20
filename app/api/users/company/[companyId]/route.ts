import { NextResponse } from "next/server";
import { getUsersByCompanyId } from "@/app/server/actions/getUsersByCompanyId";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    
    if (!companyId) {
      return new NextResponse("Company ID is required", { status: 400 });
    }

    // Convert URL slug back to company name format (e.g., "test-company-as" -> "Test Company AS")
    const convertedCompanyName = companyId
      ?.split("-")
      .map((word) =>
        word.toUpperCase() === "AS" ? "AS" : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");

  const users = await getUsersByCompanyId({ companyName: convertedCompanyName });
    return NextResponse.json(users);
  } catch (error) {
    console.error('API Error in /api/users/company/[companyId]:', error);
    return new NextResponse("Failed getting users by company", { status: 500 });
  }
}


