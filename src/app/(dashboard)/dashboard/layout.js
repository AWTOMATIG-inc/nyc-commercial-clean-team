import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const nextCookies = await cookies();
  const token = nextCookies.get("token")?.value;
  const isAdmin = await verifyToken(token);
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex font-moulpali py-4">
      <Sidebar />
      <div className="flex-1 bg-[#f4f6fb] min-h-screen">
        <Navbar />
        <div className="px-8 ">{children}</div>
      </div>
    </div>
  );
}
