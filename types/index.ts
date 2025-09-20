export type SafeRoom = {
  id: string;
  userId?: string | null;
  companyId?: string | null;
  firmanavn?: string | null;
  name?: string | null;
  createdAt: string;
  companyName: string;
};

export type safeUser = {
  id: string;
  email?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  createdAt?: string;
  updatedAt?: string;
  emailVerified?: string | null;
  companyName?: string | null;
  company?: string | null;
  role?: string | null;
};

export type SafeReservations = {
  id: string;
  roomId: string;
  roomName?: string | null;
  companyId?: string | null;
  companyName?: string | null;
  userId: string;
  createdAt?: string;
  start_date?: string;
  end_date?: string;
  text?: string;
  room?: SafeRoom;
};
