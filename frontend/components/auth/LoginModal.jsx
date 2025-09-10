"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function LoginModal({ isOpen, onClose }) {
   const [formData, setFormData] = useState({
      identifier: "",
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
         const result = await login(formData.identifier, formData.password);
         
         if (result) {
            loginUser(result);
            toast.success("Connexion réussie !");
            onClose();
         }
      } catch (error) {
         setError(error.message);
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
            
            <Card className="border-0 shadow-none">
               <CardContent className="p-0">
                  {error && (
                     <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                     </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="space-y-2">
                        <label htmlFor="identifier" className="text-sm font-medium">
                           Email ou nom d'utilisateur
                        </label>
                        <Input
                           id="identifier"
                           name="identifier"
                           type="text"
                           value={formData.identifier}
                           onChange={handleChange}
                           required
                           placeholder="Entrez votre email ou nom d'utilisateur"
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
               </CardContent>
            </Card>
         </DialogContent>
      </Dialog>
   );
}
