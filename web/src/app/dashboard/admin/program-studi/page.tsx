"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, UserCircle, Home, Database, BookOpen, Layers, RefreshCw } from "lucide-react";

export default function DataProdi() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3004/api/dashboard/admin/program-studi")
      .then(res => res.json())
      .then(json => { 
        console.log("Cek Data API Prodi:", json); // Lihat di F12 (Console) browser
        // Jika API mengirim { data: [...] } maka ganti json.prodi jadi json.data
        if(json.prodi) {
          setList(json.prodi);
        } else if (json.data) {
          setList(json.data);
        }
        setLoading(false); 
      })
      .catch(err => {
        console.error("Gagal ambil data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="col-span-8">
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 min-h-[500px]">
          <div className="flex justify-between mb-8 border-b pb-4 items-center">
            <div>
              <h2 className="text-[#800000] font-black text-2xl italic uppercase tracking-tighter flex items-center gap-2">
                <Database size={24} /> Program Studi
              </h2>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Struktur Akademik Kampus</p>
            </div>
            <button className="bg-[#800000] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase shadow-md flex items-center gap-2">
              <Plus size={14} strokeWidth={3} /> Tambah Prodi
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 text-center p-20 font-black text-[#800000] animate-pulse italic uppercase flex flex-col items-center gap-2">
                <RefreshCw className="animate-spin" /> Menyinkronkan Data...
              </div>
            ) : list?.map((p) => (
              <div key={p.id || p.kode} className="p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] group hover:border-[#800000] transition-all">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#800000] mb-3 shadow-sm group-hover:bg-[#800000] group-hover:text-white transition-all">
                  <BookOpen size={20} />
                </div>
                <h4 className="font-black text-gray-800 uppercase italic text-sm">{p.nama}</h4>
                <p className="text-[9px] text-[#800000] font-black uppercase mt-1">Kode: {p.kode}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-4">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 text-center shadow-sm sticky top-10">
          <UserCircle size={80} className="mx-auto text-gray-200 mb-4" />
          <h3 className="font-black text-[#800000] uppercase italic">Admin Sistem</h3>
          <p className="text-[9px] text-gray-400 font-bold mb-8 uppercase tracking-widest">Portal Administrasi</p>
          <Link href="/dashboard/admin" className="w-full flex items-center justify-center gap-2 py-4 border-2 border-[#800000] text-[#800000] rounded-xl font-black text-[10px] uppercase hover:bg-[#800000] hover:text-white transition-all shadow-sm group">
            <Home size={14} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}