import { createContext, useContext, useState } from 'react';

interface LoggedInContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined);

export const LoggedInProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string>("");

  return (
    <LoggedInContext.Provider value={{ username, setUsername }}>
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
