import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
   title: "S'identifier | Graph and Shop",
};

export default function LoginPage() {
   return (
      <div className="wrapper py-20">
         <h1 className="text-3xl font-bold mb-8 text-center">Connexion</h1>
         <LoginForm />
      </div>
   );
}
