import { Room, User, Reservation } from "@prisma/client";

export type SafeRoom = Omit<Room, "createdAt"> & {
  createdAt: string;
  companyName: string;
};

export type safeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt?: string;
  updatedAt?: string;
  emailVerified?: string | null;
  companyName?: string | null;
  company?: string | null;
};

export type SafeReservations = Omit<
  Reservation,
  "createdAt" | "start_date" | "end_date" | "room"
> & {
  createdAt?: string;
  start_date?: string;
  end_date?: string;
  text?: string;
  room?: SafeRoom;
};
