import { Inter, Jost } from "next/font/google";

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { WeightProvider } from "@/contexts/WeightContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { ExerciceProvider } from "@/contexts/ExerciceContext";

const inter = Inter({ subsets: ["latin"] });
const jost = Jost({
   variable: "--font-jost",
   subsets: ["latin"],
   display: "swap",
   preload: true,
   weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
   title: "Graph and Shop",
   description: "Liste de courses",
};

export default function RootLayout({ children }) {
   return (
      <html lang="fr">
         <head>
            <link rel="manifest" href="/manifest.json" />
            <link rel="icon" href="/logo512.png" />
            <meta name="theme-color" content="#ffffff" />
         </head>
         <body
            className={`${jost.variable} flex flex-col justify-between pb-20`}
         >
            <AuthProvider>
               <ProductProvider>
                  <WeightProvider>
                     <ExerciceProvider>
                        <Header />
                        <main className="grow container flex flex-col justify-between pt-6">
                           {children}
                        </main>
                        <Footer />
                        <Toaster position="top-center" />
                     </ExerciceProvider>
                  </WeightProvider>
               </ProductProvider>
            </AuthProvider>
         </body>
      </html>
   );
}
