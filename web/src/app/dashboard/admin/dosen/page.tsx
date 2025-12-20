"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, UserCircle, Home, GraduationCap, RefreshCw } from "lucide-react";

export default function DataDosen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:3004/api/dashboard/admin/dosen")
      .then(res => res.json())
      .then(json => { if(json.success) setList(json.dosen || []); setLoading(false); })
      .catch(() => { setList([]); setLoading(false); });
  }, []);

  const filtered = list?.filter(d => d.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="grid grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="col-span-8">
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 min-h-[500px]">
          <div className="flex justify-between mb-8 border-b pb-4 items-center">
            <h2 className="text-[#800000] font-black text-2xl italic uppercase tracking-tighter flex items-center gap-2">
              <GraduationCap size={24} /> Database Dosen
            </h2>
            <button className="bg-[#800000] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2">
              <Plus size={14} strokeWidth={3} /> Tambah Dosen
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-[#800000]/20" placeholder="Cari Dosen..." onChange={e => setSearchTerm(e.target.value)} />
          </div>

          <table className="w-full">
            <thead className="bg-[#800000] text-white text-[10px] font-black uppercase tracking-widest">
              <tr><th className="p-4 text-left">Nama Dosen</th><th className="p-4 text-center">NIDN</th><th className="p-4 text-center w-20">Aksi</th></tr>
            </thead>
            <tbody className="text-[11px] font-bold uppercase">
              {loading ? (
                <tr><td colSpan={3} className="p-10 text-center animate-pulse flex flex-col items-center justify-center gap-2 font-black italic text-[#800000]">
                  <RefreshCw className="animate-spin" /> Menyinkronkan Data...
                </td></tr>
              ) : filtered?.map(d => (
                <tr key={d.nidn} className="border-b border-gray-50 hover:bg-red-50/30 transition-all text-center">
                  <td className="p-4 text-left font-black">{d.namaLengkap}</td>
                  <td className="p-4 text-[#800000] font-black">{d.nidn}</td>
                  <td className="p-4"><Pencil size={14} className="mx-auto cursor-pointer" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-span-4">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 text-center shadow-sm sticky top-10">
          <UserCircle size={80} className="mx-auto text-gray-200 mb-4" />
          <h3 className="font-black text-[#800000] uppercase italic text-lg leading-none">Admin Sistem</h3>
          <p className="text-[9px] text-gray-400 font-bold mb-8 uppercase tracking-widest">Portal Administrasi</p>
          <Link href="/dashboard/admin" className="w-full flex items-center justify-center gap-2 py-4 border-2 border-[#800000] text-[#800000] rounded-xl font-black text-[10px] uppercase hover:bg-[#800000] hover:text-white transition-all shadow-sm">
            <Home size={14} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}