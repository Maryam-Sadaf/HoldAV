import getCurrentUser from "@/app/server/actions/getCurrentUser";
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { slugToCompanyName, formatRoomNameForStorage } from "@/utils/slugUtils";

// Auto-sanitize room name function
const autoSanitizeRoomName = (roomName: string): string => {
  if (!roomName) return "";
  
  return roomName
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/["']/g, '') // Remove quotes
    .replace(/[&]/g, 'and') // Replace & with 'and'
    .replace(/[\/\\]/g, ' ') // Replace slashes with spaces
    .replace(/[^a-zA-Z0-9\s-]/g, ' ') // Replace other special chars
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .trim();
};

export async function POST(request: Request) {
  try {
    // Get session directly from the request
    const session: any = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const currentUserQs = await db.collection('users').where('email', '==', session.user.email as string).limit(1).get();
    const currentUser = currentUserQs.empty ? null : ({ id: currentUserQs.docs[0].id, ...currentUserQs.docs[0].data() } as any);

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, companyName } = body;
    
    if (!companyName) {
      return NextResponse.json({ error: "companyName is required" }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Auto-sanitize room name instead of blocking
    const originalName = name;
    const sanitizedRoomName = autoSanitizeRoomName(name);
    
    // Show what was changed if sanitization occurred
    if (originalName !== sanitizedRoomName) {
      console.log(`Room name auto-sanitized: "${originalName}" -> "${sanitizedRoomName}"`);
    }

    // Convert URL format back to company name format using consistent utility
    const convertedCompanyName = companyName ? slugToCompanyName(companyName) : "";
    const providedCompanyName = companyName ?? "";
    const slugLower = (companyName || "").replace(/\s+/g, "-").toLowerCase();
    const decodedCompanyName = (() => {
      try { return decodeURIComponent(companyName || ""); } catch { return companyName || ""; }
    })();
    const decodedSpaceCompanyName = (companyName || "").includes('%20')
      ? (companyName || "").replace(/%20/g, ' ')
      : decodedCompanyName;

    // Format room name with proper title case before saving to database
    const formattedRoomName = formatRoomNameForStorage(sanitizedRoomName);

    // First, find the company to get its ID
    let company: any = null;
    const candidates = [
      convertedCompanyName,
      providedCompanyName,
      decodedCompanyName,
      decodedSpaceCompanyName,
      slugLower,
    ].filter((v, i, arr) => !!v && arr.indexOf(v) === i);
    for (const cand of candidates) {
      const q = await db.collection('companies').where('firmanavn', '==', cand).limit(1).get();
      if (!q.empty) {
        company = { id: q.docs[0].id, ...q.docs[0].data() } as any;
        break;
      }
    }

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Create the room with both companyId and companyName
    const roomRef = db.collection('rooms').doc();
    const now = new Date();
    const createRoom = {
      id: roomRef.id,
      userId: currentUser?.id,
      companyId: company.id,
      name: formattedRoomName,
      createdAt: now,
      companyName: company.firmanavn, // Use actual company name from database
    } as any;
    await roomRef.set(createRoom);

    return NextResponse.json(createRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
