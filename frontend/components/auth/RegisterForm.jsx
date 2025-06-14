"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/actions/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterForm() {
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const router = useRouter();
   const { login: authLogin } = useAuth();

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      try {
         const data = await register(username, email, password);
         authLogin(data);
         router.push("/dashboard");
      } catch (error) {
         setError(error.message);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
         {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
               {error}
            </div>
         )}
         <div>
            <label htmlFor="username" className="block text-sm font-medium">
               Nom d'utilisateur
            </label>
            <input
               type="text"
               id="username"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
               required
            />
         </div>
         <div>
            <label htmlFor="email" className="block text-sm font-medium">
               Email
            </label>
            <input
               type="email"
               id="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
               required
            />
         </div>
         <div>
            <label htmlFor="password" className="block text-sm font-medium">
               Mot de passe
            </label>
            <input
               type="password"
               id="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
               required
            />
         </div>
         <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90"
         >
            S'inscrire
         </button>
      </form>
   );
}
