"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link"; // Tambahkan ini

export default function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // Untuk mendeteksi menu mana yang aktif

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const role = localStorage.getItem("user_role");

    if (!token || role !== "MAHASISWA") {
      router.replace(role === "ADMIN" ? "/dashboard/admin" : "/");
    }
  }, [router]);

  // Daftar Menu Navigasi
  const menus = [
    { name: "Halaman Depan", path: "/dashboard/mahasiswa" },
    { name: "Biodata", path: "/dashboard/mahasiswa/biodata" }, // Pastikan folder ini ada nanti
    { name: "Perkuliahan", path: "/dashboard/mahasiswa/perkuliahan" },
    { name: "Laporan", path: "/dashboard/mahasiswa/laporan" },
  ];

  return (
    <section className="min-h-screen bg-[#F0F2F5]">
      {/* HEADER BANNER */}
      <div className="w-full bg-[#800000] shadow-md border-b-4 border-white">
        <div className="max-w-7xl mx-auto flex items-center h-16 px-4 md:px-8">
          <div className="bg-white p-1.5 rounded-sm mr-4 shadow-sm">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/a/a0/UNIVERSITASTEKNOKRAT.png" 
              alt="Logo UTI" 
              className="w-8 h-8 md:w-9 md:h-9 object-contain"
            />
          </div>
          
          <div className="text-white">
            <h1 className="text-base md:text-lg font-bold uppercase leading-none tracking-tight flex items-center gap-2">
              CAMPUS MANAGE <span className="font-thin text-white/30">|</span> 
              <span className="text-[9px] md:text-[11px] font-medium tracking-normal">Universitas Teknokrat Indonesia</span>
            </h1>
            <p className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.15em] text-gray-300 mt-1">
              Teknokrat Academic Information System
            </p>
          </div>
        </div>
      </div>

      {/* SUB-NAVIGASI DINAMIS */}
      <div className="w-full bg-white border-b border-gray-200 px-4 md:px-8 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex gap-6 text-[10px] font-bold uppercase py-2.5">
          {menus.map((menu) => (
            <Link 
              key={menu.path}
              href={menu.path}
              className={`transition-all pb-1 border-b-2 ${
                pathname === menu.path 
                ? "text-[#800000] border-[#800000]" 
                : "text-gray-500 border-transparent hover:text-[#800000]"
              }`}
            >
              {menu.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-0">{children}</div>
    </section>
  );
}