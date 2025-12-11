import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

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

    // Primary lookup: match the stored slug (firmanavn is saved as slug)
    let qs = await db.collection('companies').where('firmanavn', '==', normalizedSlug).get();

    // Fallback for any legacy records that may have been title-cased
    if (qs.empty && normalizedSlug) {
      const legacyName = normalizedSlug
        .split("-")
        .map((word) => (word.toUpperCase() === "AS" ? "AS" : word.charAt(0).toUpperCase() + word.slice(1)))
        .join(" ");
      qs = await db.collection('companies').where('firmanavn', '==', legacyName).get();
    }

    let company = null as any;
    if (!qs.empty) {
      const docs = qs.docs;
      if (requestedUserId) {
        const matchByUser = docs.find((d) => (d.data() as any)?.userId === requestedUserId);
        company = matchByUser
          ? ({ id: matchByUser.id, ...matchByUser.data() } as any)
          : ({ id: docs[0].id, ...docs[0].data() } as any);
      } else {
        company = ({ id: docs[0].id, ...docs[0].data() } as any);
      }
    }
    
    const response = NextResponse.json(company);
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=600');
    
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Failed getting users by company");
  }
}
