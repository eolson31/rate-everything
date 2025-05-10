"use client"

import { createContext, useContext, useState } from 'react';

interface UserProfile {
  id: number,
  name: string,
}

interface LoggedInContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined);

export const LoggedInProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  return (
    <LoggedInContext.Provider value={{ user, setUser }}>
      {children}
    </LoggedInContext.Provider>
  );
};

export const useLoggedIn = () => {
  const context = useContext(LoggedInContext);
  if (!context) {
    throw new Error("useLoggedIn must be used within a LoggedInProvider");
  }
  return context;
};
