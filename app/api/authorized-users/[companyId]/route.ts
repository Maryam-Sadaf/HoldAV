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
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId");

    const normalizedSlug = decodeURIComponent(companyId ?? "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    const authorizedUsers = await authorizedUser({
      companyName: normalizedSlug,
      requestedUserId,
    });

    return NextResponse.json(authorizedUsers);
  } catch (error) {
    console.error("Failed getting authorized users for companyId:", await params, error);
    throw new Error("Failed getting authorized users");
  }
}
