"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { getMe, logout as serverLogout } from "../actions/auth";

// État initial
const initialState = {
   user: null,
   isLoading: true,
   isAuthenticated: false,
};

// Actions
const AUTH_ACTIONS = {
   LOGIN_SUCCESS: "LOGIN_SUCCESS",
   LOGOUT: "LOGOUT",
   SET_LOADING: "SET_LOADING",
   SET_USER: "SET_USER",
};

// Reducer
function authReducer(state, action) {
   switch (action.type) {
      case AUTH_ACTIONS.LOGIN_SUCCESS:
         return {
            ...state,
            user: action.payload.user,
            isAuthenticated: true,
            isLoading: false,
         };

      case AUTH_ACTIONS.LOGOUT:
         return {
            ...state,
            user: null,
            isAuthenticated: false,
            isLoading: false,
         };

      case AUTH_ACTIONS.SET_LOADING:
         return {
            ...state,
            isLoading: action.payload,
         };

      case AUTH_ACTIONS.SET_USER:
         return {
            ...state,
            user: action.payload.user,
            isAuthenticated: !!action.payload.user,
            isLoading: false,
         };

      default:
         return state;
   }
}

// Contexte
const AuthContext = createContext();

// Provider
export function AuthProvider({ children }) {
   const [state, dispatch] = useReducer(authReducer, initialState);

   // Vérifier l'authentification au chargement
   useEffect(() => {
      const checkAuth = async () => {
         try {
            const result = await getMe();
            if (result.success) {
               dispatch({
                  type: AUTH_ACTIONS.SET_USER,
                  payload: { user: result.user },
               });
               return;
            }
         } catch (error) {
            console.error("Erreur lors de la vérification de l'authentification:", error);
         }

         dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      };

      checkAuth();
   }, []);

   const login = (user) => {
      dispatch({
         type: AUTH_ACTIONS.LOGIN_SUCCESS,
         payload: { user },
      });
   };

   // Fonction de déconnexion
   const logout = async () => {
      await serverLogout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
   };

   // Fonction pour mettre à jour l'utilisateur
   const updateUser = (user) => {
      dispatch({
         type: AUTH_ACTIONS.SET_USER,
         payload: { user },
      });
   };

   const value = {
      ...state,
      login,
      logout,
      updateUser,
   };

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   );
}

// Hook pour utiliser le contexte
export function useAuth() {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error("useAuth doit être utilisé dans un AuthProvider");
   }

   return context;
}
