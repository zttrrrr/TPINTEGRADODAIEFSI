import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user")) || null;
    })

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
