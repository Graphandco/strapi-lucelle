import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
   return (
      <div className="wrapper py-20">
         <h1 className="text-3xl font-bold mb-8 text-center">Inscription</h1>
         <RegisterForm />
      </div>
   );
}
