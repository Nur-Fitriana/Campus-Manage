"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, UserCircle, Home, Trash2 } from "lucide-react";

// Definisikan tipe data agar tidak ada 'any'
interface Mahasiswa {
  npm: string;
  namaLengkap: string;
}

export default function DataMahasiswa() {
  const [list, setList] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fungsi Fetch Data - Sesuaikan PORT (3004) dengan API kamu yang jalan
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3004/api/dashboard/admin/mahasiswa");
      const json = await res.json();
      if (json.success) {
        setList(json.mahasiswa);
      }
    } catch (err) {
      console.error("Gagal koneksi ke API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi Hapus (Delete)
  const handleDelete = async (npm: string) => {
    if (confirm(`Yakin ingin menghapus mahasiswa NPM: ${npm}?`)) {
      try {
        const res = await fetch(`http://localhost:3004/api/dashboard/admin/mahasiswa/${npm}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (json.success) {
          fetchData(); // Refresh tabel
        } else {
          alert("Gagal menghapus: " + json.message);
        }
      } catch (err) {
        alert("Terjadi kesalahan koneksi.");
      }
    }
  };

  const filtered = list.filter((m) =>
    m.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="col-span-8">
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8">
          <div className="flex justify-between mb-8 border-b pb-4">
            <h2 className="text-[#800000] font-black text-2xl italic uppercase tracking-tighter">
              Data Mahasiswa
            </h2>
            
            {/* TOMBOL ADD SEKARANG BISA DIKLIK */}
            <Link href="/dashboard/admin/mahasiswa/add">
              <button className="bg-[#800000] hover:bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-900/20">
                <Plus size={16} strokeWidth={3} />
                <span>Tambah Mahasiswa</span>
              </button>
            </Link>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-[#800000]/20"
              placeholder="Cari..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <table className="w-full">
            <thead className="bg-[#800000] text-white text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="p-4 text-left">Mahasiswa</th>
                <th className="p-4 text-center">NPM</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold uppercase">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center animate-pulse">Syncing...</td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.npm} className="border-b border-gray-50 hover:bg-red-50/30">
                    <td className="p-4">{m.namaLengkap}</td>
                    <td className="p-4 text-center text-[#800000]">{m.npm}</td>
                    <td className="p-4 text-center flex justify-center gap-4">
                      
                      {/* ICON PENCIL KE HALAMAN EDIT */}
                      <Link href={`/dashboard/admin/mahasiswa/edit/${m.npm}`}>
                        <Pencil size={14} className="cursor-pointer text-gray-400 hover:text-blue-600 transition-colors" />
                      </Link>

                      {/* ICON TRASH UNTUK DELETE */}
                      <button onClick={() => handleDelete(m.npm)}>
                        <Trash2 size={14} className="text-gray-400 hover:text-red-600 transition-colors" />
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-span-4">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 text-center shadow-sm">
          <UserCircle size={80} className="mx-auto text-gray-200 mb-4" />
          <h3 className="font-black text-[#800000] uppercase italic">System Admin</h3>
          <p className="text-[9px] text-gray-400 font-bold mb-8 uppercase tracking-widest">
            Administrator Portal
          </p>

          <Link
            href="/dashboard/admin"
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-[#800000] text-[#800000] rounded-xl font-black text-[10px] uppercase hover:bg-[#800000] hover:text-white transition-all shadow-sm"
          >
            <Home size={14} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}