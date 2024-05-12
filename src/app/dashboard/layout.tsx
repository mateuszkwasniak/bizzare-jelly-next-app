import type { Metadata } from "next";
import DashboardNavigationPanel from "./components/DashboardNavigationPanel";

export const metadata: Metadata = {
  title: "Bizzare Jelly",
  description: "",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  params: any;
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full max-w-[1920px] h-full min-h-[calc(100vh-40px)] md:min-h-[calc(100vh-76px)] mx-auto px-5 md:px-20 xl:px-36 2xl:px-56 pb-12 md:pb-20">
      <h1 className="text-4xl md:text-5xl font-medium text-black text-center pt-20 py-10 md:py-20 self-center">
        My Account
      </h1>
      <div className="flex flex-col md:flex-row justify-center gap-16 h-fit">
        <DashboardNavigationPanel />
        {children}
      </div>
    </div>
  );
}
