import Sidebar from "@/components/dashboard/layout/Sidebar";
import Topbar from "@/components/dashboard/layout/Topbar";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const nextCookies = await cookies();
  const token = nextCookies.get("token")?.value;
  const isAdmin = await verifyToken(token);

  if (!isAdmin) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#f4f5f7] font-inter text-slate-800 antialiased selection:bg-[#ed0505] selection:text-white">
      {/* Desktop Sidebar & Mobile Drawer */}
      <Sidebar />

      {/* Main Admin View Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
