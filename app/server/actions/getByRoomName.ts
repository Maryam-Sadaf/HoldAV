import getCurrentUser from "./getCurrentUser";
import { slugToRoomName } from "@/utils/slugUtils";
import prisma from "@/lib/prismaDB";

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

    const userWithCompany = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      include: {
        company: true,
      },
    });

    if (!userWithCompany) {
      throw new Error("User not found");
    }
    const { roomName } = params;
    
    // Convert URL format back to room name format using consistent utility
    // URL: "meeting-room-b" -> Room name: "Meeting Room B"
    const convertedRoomName = roomName ? slugToRoomName(roomName) : undefined;
    
    // Try multiple variations to handle different room name formats
    let room = await prisma.room.findUnique({
      where: {
        name: convertedRoomName,
      },
      include: {
        user: true,
        reservations: true,
      },
    });

    // If not found with Title Case, try the original roomName as-is
    if (!room && roomName) {
      room = await prisma.room.findUnique({
        where: {
          name: roomName,
        },
        include: {
          user: true,
          reservations: true,
        },
      });
    }

    // If still not found, try lowercase version
    if (!room && roomName) {
      room = await prisma.room.findUnique({
        where: {
          name: roomName.toLowerCase(),
        },
        include: {
          user: true,
          reservations: true,
        },
      });
    }

    if (!room) {
      return null;
    }

    return {
      ...room,
      createdAt: room.createdAt.toISOString(),
      user: {
        ...room.user,
        createdAt: room.user?.createdAt?.toISOString() || null,
        updatedAt: room.user?.updatedAt?.toISOString() || null,
        emailVerified: room.user?.emailVerified || null,
        // companyName: userWithCompany.company?.[0]?.firmanavn || null,
      },
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
