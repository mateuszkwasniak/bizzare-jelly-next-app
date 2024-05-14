import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/fonts/fonts";
import Navbar from "@/app/components/layout/root/Navbar";
import { refreshAuthState } from "@/app/actions/auth";
import AuthController from "./components/controller/AuthController";
import Footer from "./components/layout/root/Footer";

export const metadata: Metadata = {
  title: "Bizzare Jelly",
  description: "Niesamowite żelki na wyciągnięcie ręki",
};

export default async function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await refreshAuthState();

  return (
    <html lang="en">
      <AuthController auth={auth} />
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <div className="mt-10 md:mt-[76px] w-full grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
