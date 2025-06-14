"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { setCookie, deleteCookie } from "cookies-next";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // Vérifier si l'utilisateur est déjà connecté au chargement
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
         setUser(JSON.parse(storedUser));
      }
      setLoading(false);
   }, []);

   const login = (userData) => {
      setUser(userData);
      // Stocker dans localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      // Stocker dans un cookie
      setCookie("user", JSON.stringify(userData), {
         maxAge: 60 * 60 * 24 * 7, // 7 jours
         path: "/",
      });
   };

   const logout = () => {
      setUser(null);
      localStorage.removeItem("user");
      deleteCookie("user");
   };

   return (
      <AuthContext.Provider value={{ user, login, logout, loading }}>
         {children}
      </AuthContext.Provider>
   );
}

export const useAuth = () => useContext(AuthContext);
