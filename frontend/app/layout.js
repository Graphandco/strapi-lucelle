import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
   title: "Graph and Co",
   description: "Application de gestion de courses",
};

export default function RootLayout({ children }) {
   return (
      <html lang="fr">
         <body className={inter.className}>
            <AuthProvider>
               <ProductProvider>
                  <Header />
                  <main className="min-h-screen pt-5 pb-20">{children}</main>
                  <Footer />
                  <Toaster position="top-center" />
               </ProductProvider>
            </AuthProvider>
         </body>
      </html>
   );
}
