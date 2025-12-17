import getCurrentUser from "./getCurrentUser";
import { db } from "@/lib/firebaseAdmin";

interface IParams {
  companyName?: string;
}

export default async function getReservationByCompanyName(params: IParams) {
  try {
    const { companyName } = params;

    if (!companyName) {
      return [];
    }

    // Identify current user to apply role-based filtering
    const currentUser = await getCurrentUser();
    const isAdmin = currentUser?.role === 'admin';

    // Convert URL format back to company name format
    // URL: "test-company-as" -> Company name: "Test Company AS"
    const convertedCompanyName = companyName
      ?.split('-')
      .map(word => word.toUpperCase() === 'AS' ? 'AS' : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Resolve companyId first to avoid companyName mismatches
    const decoded = (() => { try { return decodeURIComponent(companyName); } catch { return companyName; } })();
    const withSpaces = companyName.includes('%20') ? companyName.replace(/%20/g, ' ') : decoded;
    
    // Companies are stored with firmanavn in lowercase with hyphens (see create-company route)
    // So we need to try the normalized lowercase version as well
    const normalizedSlug = decoded.trim().replace(/\s+/g, "-").toLowerCase();
    
    const nameCandidates = [
      convertedCompanyName,  // "Test Company AS" (title case with spaces)
      companyName,            // Original from URL (e.g., "Tekbex" or "test-company-as")
      decoded,                // URL decoded
      withSpaces,            // With %20 replaced by spaces
      normalizedSlug,         // Lowercase with hyphens (e.g., "tekbex" or "test-company-as")
      companyName.toLowerCase(), // Lowercase original
    ]
      .filter((v): v is string => !!v)
      .filter((v, i, a) => a.indexOf(v) === i);

    let companyId: string | null = null;
    for (const cand of nameCandidates) {
      const cqs = await db.collection('companies').where('firmanavn', '==', cand).limit(1).get();
      if (!cqs.empty) {
        companyId = cqs.docs[0].id;
        break;
      }
    }

    // Fetch reservations primarily by companyId (robust), fallback to companyName if needed
    let reservations: any[] = [];
    if (companyId) {
      const rqs = await db.collection('reservations').where('companyId', '==', companyId).limit(500).get();
      reservations = rqs.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    } else {
      const snapshots = await Promise.all(
        nameCandidates.map((cand) => db.collection('reservations').where('companyName', '==', cand).limit(500).get())
      );
      const mergedMap = new Map<string, any>();
      snapshots.forEach((qs) => {
        qs.docs.forEach((d) => mergedMap.set(d.id, { id: d.id, ...d.data() }));
      });
      reservations = Array.from(mergedMap.values());
    }

    // Apply role filter in-memory to avoid composite index constraints
    if (!isAdmin && currentUser?.id) {
      reservations = reservations.filter((r) => r.userId === currentUser.id);
    }

    // Sort by createdAt desc in-memory
    reservations.sort((a: any, b: any) => {
      const ad = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0));
      const bd = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0));
      return bd.getTime() - ad.getTime();
    });

    if (!reservations || reservations.length === 0) {
      return [];
    }

    // OPTIMIZED: Batch process date serialization
    const safeReservations = reservations.map((reservation: any) => {
      const start = reservation.start_date?.toDate ? reservation.start_date.toDate() : new Date(reservation.start_date);
      const end = reservation.end_date?.toDate ? reservation.end_date.toDate() : new Date(reservation.end_date);
      const created = reservation.createdAt?.toDate ? reservation.createdAt.toDate() : (reservation.createdAt ? new Date(reservation.createdAt) : undefined);
      
      return {
        ...reservation,
        createdAt: created?.toISOString(),
        start_date: start?.toISOString(),
        end_date: end?.toISOString(),
      };
    });

    return safeReservations;
  } catch (error: any) {
    console.error('Error in getReservationByCompanyName:', error);
    return []; // Return empty array instead of throwing
  }
}
