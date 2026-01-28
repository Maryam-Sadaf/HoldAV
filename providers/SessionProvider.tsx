"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
  session?: any;
}

export default function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider 
      session={session}
      refetchInterval={0} // Disable automatic refetch
      refetchOnWindowFocus={true} // Refetch when window gets focus
      refetchWhenOffline={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
