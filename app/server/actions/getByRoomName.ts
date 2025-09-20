import getCurrentUser from "./getCurrentUser";
import { slugToRoomName } from "@/utils/slugUtils";
import { db } from "@/lib/firebaseAdmin";

interface IParams {
  roomName?: string;
  roomId?: string;
}

export default async function getRoomByName(params: IParams) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }

    // Firestore: no join needed for this function's return shape
    const userWithCompany = { id: currentUser.id } as any;

    if (!userWithCompany) {
      throw new Error("User not found");
    }
    const { roomName } = params;
    
    // Convert URL format back to room name format using consistent utility
    // URL: "meeting-room-b" -> Room name: "Meeting Room B"
    const convertedRoomName = roomName ? slugToRoomName(roomName) : undefined;
    
    // Try multiple variations to handle different room name formats
    const qs1 = convertedRoomName ? await db.collection('rooms').where('name', '==', convertedRoomName).limit(1).get() : { empty: true } as any;
    let room: any = !qs1.empty ? ({ id: qs1.docs[0].id, ...qs1.docs[0].data() }) : null;

    // If not found with Title Case, try the original roomName as-is
    if (!room && roomName) {
      const qs2 = await db.collection('rooms').where('name', '==', roomName).limit(1).get();
      room = !qs2.empty ? ({ id: qs2.docs[0].id, ...qs2.docs[0].data() }) : null;
    }

    // If still not found, try lowercase version
    if (!room && roomName) {
      const qs3 = await db.collection('rooms').where('name', '==', roomName.toLowerCase()).limit(1).get();
      room = !qs3.empty ? ({ id: qs3.docs[0].id, ...qs3.docs[0].data() }) : null;
    }

    if (!room) {
      return null;
    }

    return {
      ...room,
      createdAt: room.createdAt?.toDate ? room.createdAt.toDate().toISOString() : room.createdAt,
    } as any;
  } catch (error: any) {
    throw new Error(error);
  }
}
