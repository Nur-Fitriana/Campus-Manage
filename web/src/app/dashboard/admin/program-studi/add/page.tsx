"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Database } from "lucide-react";
import Link from "next/link";

export default function AddProdi() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    nama: "", 
    kode: "", 
    jenjang: "S1", 
    fakultas: "" // Dikosongkan agar bebas diisi
  });

  const handleSubmit = async (e: FormEvent) => {
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
        alert("✅ Berhasil menyimpan!");
        router.push("/dashboard/admin/program-studi");
        router.refresh();
      } else {
        alert("❌ Gagal: " + json.message);
      }
    } catch (err) {
      alert("❌ Koneksi gagal!");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-10">
      <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-xl p-10 border">
        <Link href="/dashboard/admin/program-studi" className="flex items-center gap-2 mb-8 text-gray-400 font-black text-[10px] uppercase tracking-widest">
          <ArrowLeft size={14} /> Kembali Ke Daftar
        </Link>

        <h2 className="text-[#800000] font-black text-2xl italic uppercase mb-10 flex items-center gap-2">
          <Database size={24} /> Tambah Prodi
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            placeholder="NAMA PROGRAM STUDI" required 
            className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-[#800000]/10 outline-none" 
            onChange={e => setForm({...form, nama: e.target.value.toUpperCase()})} 
          />
          <input 
            placeholder="KODE PRODI" required 
            className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-[#800000]/10 outline-none" 
            onChange={e => setForm({...form, kode: e.target.value.toUpperCase()})} 
          />
          <select 
            className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none"
            onChange={e => setForm({...form, jenjang: e.target.value})}
          >
            <option value="S1">S1 - SARJANA</option>
            <option value="D3">D3 - DIPLOMA</option>
            <option value="S2">S2 - MAGISTER</option>
          </select>
          {/* Input Fakultas yang bebas diisi */}
          <input 
            placeholder="INPUT NAMA FAKULTAS" 
            required 
            className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-[#800000]/10 outline-none" 
            onChange={e => setForm({...form, fakultas: e.target.value.toUpperCase()})} 
          />

          <button type="submit" disabled={loading} className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black uppercase shadow-lg active:scale-95 disabled:bg-gray-400">
            {loading ? "PROSES..." : "SIMPAN DATA SEKARANG"}
          </button>
        </form>
      </div>
    </div>
  );
}