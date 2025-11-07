
import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import TopbarWrapper from "./components/TopbarWrapper";
import { Toaster } from "sonner";
import Footer from "./components/footer";
import FooterWrapper from "./components/FooterWrapper";


const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: "700",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SogoSupa",
  description: "Your onestop destination for shopping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${lato.variable} antialiased`}>
      <head>
        <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />  
      </head>
      <body className={`${montserrat.variable} ${lato.variable} antialiased`} >
        
        <AuthProvider>
          <CartProvider>
            <TopbarWrapper>
              <FooterWrapper>
                {children}
              </FooterWrapper>
            </TopbarWrapper>
          </CartProvider>
        </AuthProvider>
        <Toaster 
          position="top-center"
          richColors
          toastOptions={{
          duration: 2500,
          style: { fontWeight: 500 },
          }}
        />
      </body>
    </html>
  );
}
