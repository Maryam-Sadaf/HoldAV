import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import getCurrentUser from "@/app/server/actions/getCurrentUser";

export async function GET() {
  try {
    // Get current user to filter by adminId
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentAdminId = currentUser.id;
    const snapshot = await db.collection("users").orderBy("createdAt", "desc").get();

    // Preload companies into a map for quick lookup by id
    // We'll lazily load company documents referenced by users to minimize reads
    const companyCache = new Map<string, any>(); // key: companyId
    const userCache = new Map<string, any>(); // key: userId
    const invitedCache = new Map<string, any>(); // key: userId
    const adminCompanyCache = new Map<string, any>(); // key: admin userId

    const results = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data() as any;
        const userId = doc.id;

        const firstname = data?.firstname ?? null;
        const lastname = data?.lastname ?? null;
        const fullName = [firstname, lastname].filter(Boolean).join(" ") || null;

        // Resolve companyId/adminId from user doc or invitedUsers fallback
        let companyId: string | null = data?.companyId ?? null;
        let adminId: string | null = data?.adminId ?? null;

        if (!companyId || !adminId) {
          let invited = invitedCache.get(userId);
          if (invited === undefined) {
            const invitedQs = await db
              .collection("invitedUsers")
              .where("userId", "==", userId)
              .limit(1)
              .get();
            invited = invitedQs.empty ? null : ({ id: invitedQs.docs[0].id, ...invitedQs.docs[0].data() } as any);
            invitedCache.set(userId, invited);
          }
          if (invited) {
            companyId = companyId || invited?.companyId || null;
            adminId = adminId || invited?.adminId || null;
          }
        }

        let companyName: string | null = null;
        if (companyId) {
          const cachedCompany = companyCache.get(companyId);
          if (cachedCompany) {
            companyName = cachedCompany?.firmanavn ?? cachedCompany?.name ?? null;
          } else {
            const companySnap = await db.collection("companies").doc(String(companyId)).get();
            const company = companySnap.exists ? ({ id: companySnap.id, ...companySnap.data() } as any) : null;
            if (company) {
              companyCache.set(companyId, company);
              companyName = company?.firmanavn ?? company?.name ?? null;
            }
          }
        } else if (data?.role === "admin") {
          // Admins may not have companyId on user; try find company where userId == this admin
          let adminCompany = adminCompanyCache.get(userId);
          if (adminCompany === undefined) {
            const cqs = await db
              .collection("companies")
              .where("userId", "==", userId)
              .limit(1)
              .get();
            adminCompany = cqs.empty ? null : ({ id: cqs.docs[0].id, ...cqs.docs[0].data() } as any);
            adminCompanyCache.set(userId, adminCompany);
          }
          if (adminCompany) {
            companyName = adminCompany?.firmanavn ?? adminCompany?.name ?? null;
            companyId = adminCompany?.id ?? companyId;
          }
        }

        // Determine createdBy display value
        let createdBy: string | null = null;
        if (adminId) {
          // Try to load creator from users first
          const cachedAdmin = userCache.get(adminId);
          let admin: any = cachedAdmin;
          if (!admin) {
            const adminSnap = await db.collection("users").doc(String(adminId)).get();
            admin = adminSnap.exists ? ({ id: adminSnap.id, ...adminSnap.data() } as any) : null;
            if (admin) userCache.set(adminId, admin);
          }
          if (admin) {
            const adminName = [admin?.firstname, admin?.lastname].filter(Boolean).join(" ");
            createdBy = adminName ? `${adminName} (Admin)` : "Admin";
          } else if (companyId) {
            const company = companyCache.get(companyId);
            if (company) {
              createdBy = company?.firmanavn ?? company?.name ?? null;
            }
          }
        } else if (companyName) {
          createdBy = companyName;
        }

        const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data?.createdAt ?? null;

        return {
          fullName,
          email: data?.email ?? null,
          role: data?.role ?? null,
          companyName,
          createdBy,
          userId,
          createdAt,
          adminId, // Include adminId for filtering
        };
      })
    );

    // Filter to only show users created/invited by the current admin
    const filteredResults = results.filter((user) => {
      // Only show users where adminId matches the current admin's userId
      // Ensure both values are strings for proper comparison
      const userAdminId = user.adminId ? String(user.adminId) : null;
      const adminIdToMatch = String(currentAdminId);
      return userAdminId === adminIdToMatch;
    });

    return NextResponse.json(filteredResults, { status: 200 });
  } catch (error: any) {
    console.error("/api/all-users error:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}


