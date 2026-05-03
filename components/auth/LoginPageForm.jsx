"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { mapSupabaseUser } from "@/lib/auth/map-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPageForm() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const { login: loginUser } = useAuth();

   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");

   const nextPath = searchParams.get("next") || "/";

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
            console.error("[LoginPageForm] signInWithPassword:", signInError);
            setError(signInError.message || "Identifiants invalides");
            toast.error("Erreur de connexion");
            return;
         }

         if (!data.user) {
            console.error("[LoginPageForm] signInWithPassword: pas d'utilisateur", data);
            setError("Connexion impossible");
            toast.error("Erreur de connexion");
            return;
         }

         loginUser(mapSupabaseUser(data.user));
         toast.success("Connexion réussie !");
         router.refresh();
         router.replace(nextPath);
      } catch (err) {
         console.error("[LoginPageForm]", err);
         setError(
            err instanceof Error
               ? err.message
               : "Une erreur est survenue lors de la connexion",
         );
         toast.error("Erreur de connexion");
      } finally {
         setIsLoading(false);
      }
   };

   const handleChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   return (
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-card p-6 shadow-sm">
         <h1 className="text-center text-2xl font-semibold text-white">Connexion</h1>
         <p className="mt-2 text-center text-sm text-muted-foreground">
            Connectez-vous pour accéder à vos produits.
         </p>

         {error ? (
            <div className="mt-4 rounded border border-red-400 bg-red-100 p-3 text-sm text-red-700">
               {error}
            </div>
         ) : null}

         <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
               <label htmlFor="email" className="text-sm font-medium text-white">
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
               <label htmlFor="password" className="text-sm font-medium text-white">
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

            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
         </form>

         <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
               href={`/signup${searchParams.get("next") ? `?next=${encodeURIComponent(searchParams.get("next"))}` : ""}`}
               className="font-medium text-primary underline-offset-4 hover:underline"
            >
               Créer un compte
            </Link>
         </p>
      </div>
   );
}
