"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, UserCircle, Home, GraduationCap, RefreshCw, Trash2 } from "lucide-react";

interface Dosen {
  id: string;
  nip: string;
  namaLengkap: string;
  email?: string;
}

export default function DataDosen() {
  const [list, setList] = useState<Dosen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // WAJIB: Gunakan http:// dan port 3004
      const res = await fetch("http://localhost:3004/api/dashboard/admin/dosen", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      const json = await res.json();
      
      if (json.success) {
        // Ambil dari json.data sesuai format API kamu di gambar
        setList(json.data || []);
      } else {
        console.error("API Error:", json.message);
      }
    } catch (err: unknown) {
      console.error("Gagal terhubung ke Backend 3004. Pastikan server menyala.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadData(); 
  }, [loadData]);

  const handleDelete = async (nip: string, nama: string) => {
    if (!confirm(`Hapus dosen ${nama}?`)) return;
    try {
      const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${nip}`, { 
        method: "DELETE" 
      });
      const result = await res.json();
      
      if (result.success) {
        alert("✅ Berhasil dihapus");
        loadData();
      } else {
        alert(`❌ Gagal: ${result.message}`);
      }
    } catch (err: unknown) { 
      alert("❌ Gagal hapus, periksa koneksi ke port 3004"); 
    }
  };

  const filtered = list.filter((d) => 
    d.namaLengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.nip?.includes(searchTerm)
  );

  return (
    <div className="grid grid-cols-12 gap-6 p-4 font-sans">
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 min-h-[500px]">
          <div className="flex justify-between mb-8 border-b pb-4 items-center">
            <h2 className="text-[#800000] font-black text-2xl italic uppercase tracking-tighter flex items-center gap-2">
              <GraduationCap size={24} /> Database Dosen
            </h2>
            <Link href="/dashboard/admin/dosen/add" className="bg-[#800000] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 hover:bg-black transition-all">
              <Plus size={14} /> Tambah Dosen
            </Link>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-[#800000]/20" 
              placeholder="Cari Nama atau NIP Dosen..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#800000] text-white text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-4 text-left">Nama Dosen</th>
                  <th className="p-4 text-center">NIP</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-bold uppercase">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-10 text-center">
                      <RefreshCw className="animate-spin inline mr-2 text-[#800000]"/> Sinkronisasi Data...
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((d) => (
                    <tr key={d.id} className="border-b border-gray-50 hover:bg-red-50/30 transition-all">
                      <td className="p-4 text-left font-black">{d.namaLengkap}</td>
                      <td className="p-4 text-[#800000] font-black text-center">{d.nip}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-4">
                          <Link href={`/dashboard/admin/dosen/edit/${d.nip}`}>
                            <Pencil size={15} className="text-blue-600" />
                          </Link>
                          <button onClick={() => handleDelete(d.nip, d.namaLengkap)}>
                            <Trash2 size={15} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-gray-400 italic">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 text-center shadow-sm sticky top-10">
          <UserCircle size={80} className="mx-auto text-gray-200 mb-4" />
          <h3 className="font-black text-[#800000] uppercase italic text-lg leading-none">Admin Sistem</h3>
          <p className="text-[10px] text-gray-400 font-bold mt-2 tracking-widest uppercase">Portal Administrasi</p>
          <Link href="/dashboard/admin" className="mt-8 w-full flex items-center justify-center gap-2 py-4 border-2 border-[#800000] text-[#800000] rounded-xl font-black text-[10px] uppercase hover:bg-[#800000] hover:text-white transition-all shadow-sm">
            <Home size={14} /> Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}