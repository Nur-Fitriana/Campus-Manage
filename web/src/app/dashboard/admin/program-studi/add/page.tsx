"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Database, Hash, BookOpen } from "lucide-react";
import Link from "next/link";

export default function AddProdi() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama: "", kode: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3004/api/dashboard/admin/program-studi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.success) {
        alert("✅ Program Studi Berhasil Ditambahkan!");
        router.push("/dashboard/admin/program-studi");
        router.refresh();
      } else {
        alert("❌ Gagal: " + json.message);
      }
    } catch (err) {
      alert("❌ Gagal terhubung ke server backend 3004");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-2xl p-10 border border-white">
        <Link href="/dashboard/admin/program-studi" className="flex items-center gap-2 mb-8 text-gray-400 hover:text-[#800000] font-black text-[10px] uppercase tracking-widest transition-all">
          <ArrowLeft size={14} /> Kembali
        </Link>

        <div className="mb-10 border-b pb-6">
          <h2 className="text-[#800000] font-black text-3xl italic uppercase tracking-tighter flex items-center gap-3">
            <Database size={30} /> Tambah Program Studi
          </h2>
          <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.3em] mt-2">Input Struktur Akademik Baru</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nama Program Studi</label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all"
                placeholder="Contoh: TEKNIK INFORMATIKA"
                value={form.nama}
                onChange={e => setForm({...form, nama: e.target.value.toUpperCase()})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Kode Prodi</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all"
                placeholder="Contoh: INF-01"
                value={form.kode}
                onChange={e => setForm({...form, kode: e.target.value.toUpperCase()})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.4em] shadow-lg hover:bg-black transition-all flex items-center justify-center gap-3 mt-10 disabled:bg-gray-300"
          >
            <Save size={20} /> {loading ? "Menyimpan..." : "Simpan Data Prodi"}
          </button>
        </form>
      </div>
    </div>
  );
}