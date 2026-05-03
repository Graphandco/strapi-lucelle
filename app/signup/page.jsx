import { Suspense } from "react";
import SignupPageForm from "@/components/auth/SignupPageForm";

export const metadata = {
   title: "Inscription | Graph and Shop",
   description: "Créer un compte",
};

export default function SignupPage() {
   return (
      <section className="flex min-h-[70svh] items-center justify-center py-10">
         <Suspense fallback={<div className="text-white text-sm">Chargement...</div>}>
            <SignupPageForm />
         </Suspense>
      </section>
   );
}
