"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Database } from "lucide-react";
import Link from "next/link";

interface ProdiForm {
  nama: string;
  kode: string;
  jenjang: string;
  fakultas: string;
}

export default function AddProdi() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<ProdiForm>({ 
    nama: "", 
    kode: "", 
    jenjang: "S1", 
    fakultas: "FAKULTAS TEKNIK DAN ILMU KOMPUTER" 
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        alert("✅ Berhasil: Program Studi disimpan!");
        router.push("/dashboard/admin/program-studi");
        router.refresh();
      } else {
        alert("❌ Gagal: " + json.message);
      }
    } catch (err) {
      alert("❌ Koneksi Gagal: Cek backend port 3004");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-10">
      <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-xl p-10 border border-white">
        <Link 
          href="/dashboard/admin/program-studi" 
          className="flex items-center gap-2 mb-8 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-[#800000] transition-colors"
        >
          <ArrowLeft size={14} /> Kembali
        </Link>

        <h2 className="text-[#800000] font-black text-2xl italic uppercase mb-10 flex items-center gap-2">
          <Database size={24} /> Input Prodi Baru
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Nama Program Studi</label>
            <input 
              placeholder="CONTOH: TEKNIK INFORMATIKA" 
              required 
              className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-[#800000]/10 transition-all" 
              onChange={e => setForm({...form, nama: e.target.value.toUpperCase()})} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Kode Prodi</label>
            <input 
              placeholder="CONTOH: IF" 
              required 
              className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-[#800000]/10 transition-all" 
              onChange={e => setForm({...form, kode: e.target.value.toUpperCase()})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Jenjang</label>
              <select 
                className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-[#800000]/10 transition-all"
                onChange={e => setForm({...form, jenjang: e.target.value})}
              >
                <option value="S1">S1 - SARJANA</option>
                <option value="D3">D3 - DIPLOMA</option>
                <option value="S2">S2 - MAGISTER</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Fakultas</label>
              <input 
                placeholder="FAKULTAS" 
                required 
                value={form.fakultas}
                className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-[#800000]/10 transition-all" 
                onChange={e => setForm({...form, fakultas: e.target.value.toUpperCase()})} 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black uppercase text-[11px] mt-6 shadow-lg hover:bg-black transition-all disabled:bg-gray-400 active:scale-95"
          >
            {loading ? "SEDANG MENYIMPAN..." : "SIMPAN DATA PRODI"}
          </button>
        </form>
      </div>
    </div>
  );
}