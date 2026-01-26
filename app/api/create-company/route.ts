import getCurrentUser from "@/app/server/actions/getCurrentUser";
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { sanitizeRoomName, formatRoomNameForStorage } from "@/utils/slugUtils";

// Auto-sanitize company name function - converts special chars instead of blocking
const autoSanitizeCompanyName = (companyName: string): string => {
  if (!companyName) return "";
  
  return companyName
    .trim()
    // Replace dangerous characters with safe alternatives
    .replace(/[<>]/g, '') // Remove angle brackets completely
    .replace(/["']/g, '') // Remove quotes completely
    .replace(/[&]/g, 'and') // Replace & with 'and'
    .replace(/[\/\\]/g, ' ') // Replace slashes with spaces
    .replace(/[^a-zA-Z0-9\s-]/g, ' ') // Replace other special chars with spaces
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .trim();
};

const formatCompanyNameForStorage = (companyName: string): string => {
  if (!companyName) return "";
  
  const sanitized = autoSanitizeCompanyName(companyName);
  
  return sanitized
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return;
    }

    const body = await request.json();
    const {
      organisasjonsnummer,
      firmanavn,
      adresse,
      postnummer,
      poststed,
      fornavn,
      etternavn,
      epost,
    } = body;

    // Auto-sanitize company name instead of blocking
    const originalName = firmanavn;
    const sanitizedCompanyName = formatCompanyNameForStorage(firmanavn);
    
    // Show what was changed if sanitization occurred
    if (originalName !== sanitizedCompanyName) {
      console.log(`Company name auto-sanitized: "${originalName}" -> "${sanitizedCompanyName}"`);
    }

    const companyRef = db.collection('companies').doc();
    const companyDetails = {
      id: companyRef.id,
      organisasjonsnummer,
      firmanavn: sanitizedCompanyName, // Use sanitized name
      adresse,
      postnummer,
      poststed,
      fornavn,
      etternavn,
      epost,
      userId: currentUser?.id,
    } as any;
    await companyRef.set({ ...companyDetails });
    await db.collection('users').doc(currentUser?.id as string).update({ role: "admin", updatedAt: new Date() });
    return NextResponse.json(companyDetails);
  } catch (error) {
    console.error("Error in POST endpoint:", error);
    return NextResponse.error();
  }
}
