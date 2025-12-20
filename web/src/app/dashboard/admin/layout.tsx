"use client";
import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const role = localStorage.getItem("user_role");
    if (!token || role !== "ADMIN") {
      router.replace(role === "MAHASISWA" ? "/dashboard/mahasiswa" : "/");
    }
  }, [router]);

  const doLogoutTotal = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 fixed h-full shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-10 px-2">
            <ShieldCheck className="text-[#800000]" size={24} />
            <h1 className="text-xl font-black text-[#800000] italic uppercase tracking-tighter text-wrap leading-none">Campus <br/> Manage</h1>
          </div>
          <nav className="space-y-2">
            <Link
              href="/dashboard/admin"
              className={`flex items-center gap-3 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition ${
                pathname === "/dashboard/admin" 
                ? "bg-[#800000] text-white shadow-lg" 
                : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard size={18} /> Beranda
            </Link>
          </nav>
        </div>

        <button 
          onClick={doLogoutTotal}
          className="flex items-center gap-3 p-4 text-red-600 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 rounded-2xl transition"
        >
          <LogOut size={18} /> Keluar Sistem
        </button>
      </aside>

      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-10 justify-end">
          <span className="text-[10px] font-black text-white bg-[#800000] px-3 py-1 rounded-full uppercase tracking-widest">
            Admin Sistem
          </span>
        </header>
        <div className="p-10">{children}</div>
      </main>
    </div>
  );
}// final polish
