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

export default function SignupPageForm() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const { login: loginUser } = useAuth();

   const [formData, setFormData] = useState({
      displayName: "",
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
         const displayName = formData.displayName.trim();
         const { data, error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
               data: {
                  display_name: displayName,
                  full_name: displayName,
               },
            },
         });

         if (signUpError) {
            console.error("[SignupPageForm] signUp:", signUpError);
            setError(signUpError.message || "Inscription impossible");
            toast.error("Erreur d'inscription");
            return;
         }

         if (data.user && data.session) {
            loginUser(mapSupabaseUser(data.user));
            toast.success("Compte créé !");
            router.refresh();
            router.replace(nextPath);
            return;
         }

         if (data.user && !data.session) {
            toast.info(
               "Compte créé. Vérifiez vos emails pour confirmer, puis connectez-vous.",
            );
            router.replace("/login");
            return;
         }

         console.error("[SignupPageForm] réponse signUp inattendue:", data);
         setError("Inscription impossible");
         toast.error("Erreur d'inscription");
      } catch (err) {
         console.error("[SignupPageForm]", err);
         setError(
            err instanceof Error
               ? err.message
               : "Une erreur est survenue lors de l'inscription",
         );
         toast.error("Erreur d'inscription");
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
         <h1 className="text-center text-2xl font-semibold text-white">
            Créer un compte
         </h1>
         <p className="mt-2 text-center text-sm text-muted-foreground">
            Inscrivez-vous avec votre email et un mot de passe.
         </p>

         {error ? (
            <div className="mt-4 rounded border border-red-400 bg-red-100 p-3 text-sm text-red-700">
               {error}
            </div>
         ) : null}

         <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
               <label
                  htmlFor="displayName"
                  className="text-sm font-medium text-white"
               >
                  Nom affiché
               </label>
               <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder="Comment vous appeler dans l'app"
               />
            </div>

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
                  minLength={6}
                  placeholder="Au moins 6 caractères"
               />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? "Inscription..." : "S'inscrire"}
            </Button>
         </form>

         <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link
               href={`/login${searchParams.get("next") ? `?next=${encodeURIComponent(searchParams.get("next"))}` : ""}`}
               className="font-medium text-primary underline-offset-4 hover:underline"
            >
               Se connecter
            </Link>
         </p>
      </div>
   );
}
