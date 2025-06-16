import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
   title: "Next.js + Strapi Auth",
   description: "Authentication with Next.js and Strapi",
};

export default function RootLayout({ children }) {
   return (
      <html lang="fr">
         <body className={inter.className}>
            <AuthProvider>
               <div className="container">
                  <Header />
                  <main>{children}</main>
               </div>
               <Footer />
            </AuthProvider>
         </body>
      </html>
   );
}
