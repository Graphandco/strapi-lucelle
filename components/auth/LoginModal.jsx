"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { mapSupabaseUser } from "@/lib/auth/map-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function LoginModal({ isOpen, onClose }) {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");

   const { login: loginUser } = useAuth();

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
         const supabase = createClient();
         const { data, error: signInError } =
            await supabase.auth.signInWithPassword({
               email: formData.email,
               password: formData.password,
            });

         if (signInError) {
            setError(signInError.message);
            toast.error("Erreur de connexion");
            return;
         }

         if (!data.user) {
            setError("Connexion impossible");
            toast.error("Erreur de connexion");
            return;
         }

         loginUser(mapSupabaseUser(data.user));
         toast.success("Connexion réussie !");
         onClose();
      } catch (err) {
         setError("Une erreur est survenue lors de la connexion");
         toast.error("Erreur de connexion");
      } finally {
         setIsLoading(false);
      }
   };

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   if (!isOpen) return null;

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle className="text-center text-xl font-semibold">
                  Connexion
               </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
               {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                     {error}
                  </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                     <label htmlFor="email" className="text-sm font-medium">
                        Adresse email
                     </label>
                     <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Entrez votre email"
                     />
                  </div>

                  <div className="space-y-2">
                     <label htmlFor="password" className="text-sm font-medium">
                        Mot de passe
                     </label>
                     <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Entrez votre mot de passe"
                     />
                  </div>

                  <Button
                     type="submit"
                     className="w-full"
                     disabled={isLoading}
                  >
                     {isLoading ? "Connexion..." : "Se connecter"}
                  </Button>
               </form>
            </div>
         </DialogContent>
      </Dialog>
   );
}
