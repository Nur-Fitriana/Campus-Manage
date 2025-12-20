"use client";
import { Users, GraduationCap, Database, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardAdmin() {
  const menus = [
    { name: "Mahasiswa", href: "/dashboard/admin/mahasiswa", icon: Users, color: "bg-blue-600" },
    { name: "Dosen", href: "/dashboard/admin/dosen", icon: GraduationCap, color: "bg-blue-600" },
    { name: "Program Studi", href: "/dashboard/admin/program-studi", icon: Database, color: "bg-blue-600" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-800 italic uppercase tracking-tighter">Panel <span className="text-[#800000]">Utama</span></h1>
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">Pilih modul manajemen data</p>
      </div>

      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {menus.map((m, i) => (
          <Link key={i} href={m.href} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 group">
            <div className={`${m.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
              <m.icon size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase italic mb-4">Database {m.name}</h3>
            <div className="flex items-center gap-2 text-[#800000] font-black text-[10px] uppercase tracking-widest">
              Buka Data <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}