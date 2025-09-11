import { NextResponse } from "next/server";
import { authorizedUser } from "@/app/server/actions/authorizedUsers";

interface IParams {
  userId?: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    const authorizedUsers = await authorizedUser({
      companyName: companyId,
    });

    return NextResponse.json(authorizedUsers);
  } catch (error) {
    console.error(error);
    throw new Error("Failed getting authorized users");
  }
}
