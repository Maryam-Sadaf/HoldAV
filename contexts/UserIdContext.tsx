// @ts-nocheck
// @ts-ignore
export {};

import React, { createContext, useContext, ReactNode } from 'react';

interface UserIdContextProps {
  userId: string | undefined;
  setUserId: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
}

let UserIdContext: React.Context<UserIdContextProps | undefined>;

if (typeof window !== 'undefined') {
  const dynamicReact = import('react');
  const createContextClientOnly = dynamicReact.then((r) => r.createContext);

  UserIdContext = createContextClientOnly<UserIdContextProps | undefined>(undefined);
} else {
  UserIdContext = createContext<UserIdContextProps | undefined>(undefined);
}

export const UserIdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = typeof window !== 'undefined' ? React.useState<string | undefined>(undefined) : [undefined, undefined];

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
};

export const useUserId = () => {
  const context = useContext(UserIdContext);
  if (!context) {
    throw new Error('useUserId must be used within a UserIdProvider');
  }

  return context;
};
