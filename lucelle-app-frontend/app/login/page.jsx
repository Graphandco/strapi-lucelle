import { Suspense } from "react";
import LoginPageForm from "@/components/auth/LoginPageForm";

export const metadata = {
   title: "Connexion | Graph and Shop",
   description: "Connexion a l'application",
};

export default function LoginPage() {
   return (
      <section className="flex min-h-[70svh] items-center justify-center py-10">
         <Suspense fallback={<div className="text-white text-sm">Chargement...</div>}>
            <LoginPageForm />
         </Suspense>
      </section>
   );
}
