"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Database, RefreshCw } from "lucide-react";
import Link from "next/link";

// 1. Definisikan Interface untuk Tipe Data Prodi
interface ProgramStudi {
  id?: string;
  nama: string;
  kode: string;
  jenjang: string;
  fakultas: string;
}

interface ApiResponse {
  success: boolean;
  data: ProgramStudi[];
  message?: string;
}

export default function EditProdiSlug() {
  const router = useRouter();
  const params = useParams();
  
  // Pastikan params.slug adalah string
  const currentSlug = typeof params.slug === 'string' ? params.slug : "";

  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  
  const [oldKode, setOldKode] = useState<string>(""); 
  const [form, setForm] = useState<ProgramStudi>({ 
    nama: "", 
    kode: "", 
    jenjang: "S1", 
    fakultas: "" 
  });

  useEffect(() => {
    if (!currentSlug) return;

    fetch(`http://localhost:3004/api/dashboard/admin/program-studi`)
      .then((res) => res.json())
      .then((json: ApiResponse) => {
        // Cari data berdasarkan kode (slug) tanpa 'any'
        const dataTarget = json.data.find((item) => item.kode === currentSlug);
        
        if (dataTarget) {
          setForm({
            nama: dataTarget.nama,
            kode: dataTarget.kode,
            jenjang: dataTarget.jenjang,
            fakultas: dataTarget.fakultas
          });
          setOldKode(dataTarget.kode);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat data:", err);
        setLoading(false);
      });
  }, [currentSlug]);

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const res = await fetch("http://localhost:3004/api/dashboard/admin/program-studi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, oldKode }), 
      });
      
      const json = await res.json();
      
      if (json.success) {
        alert(`✅ Data ${form.nama} berhasil diupdate!`);
        router.push("/dashboard/admin/program-studi");
        router.refresh();
      } else {
        alert("❌ Gagal: " + json.message);
      }
    } catch (err) {
      alert("❌ Gagal update! Periksa koneksi ke server.");
    } finally { 
      setUpdating(false); 
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center font-black italic uppercase">
        <RefreshCw className="animate-spin mx-auto mb-2" /> 
        Membuka Data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-10">
      <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-xl p-10 border border-white">
        <Link href="/dashboard/admin/program-studi" className="flex items-center gap-2 mb-8 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-[#800000]">
          <ArrowLeft size={14} /> Kembali
        </Link>

        <h2 className="text-[#800000] font-black text-2xl italic uppercase mb-10 flex items-center gap-2">
          <Database size={24} /> Edit Prodi: {currentSlug}
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Nama Program Studi</label>
            <input 
              value={form.nama} 
              placeholder="NAMA PRODI" 
              required 
              className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-[#800000]/10 outline-none" 
              onChange={e => setForm({...form, nama: e.target.value.toUpperCase()})} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Kode Prodi</label>
            <input 
              value={form.kode} 
              placeholder="KODE PRODI" 
              required 
              className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-[#800000]/10 outline-none" 
              onChange={e => setForm({...form, kode: e.target.value.toUpperCase()})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Jenjang</label>
              <select 
                value={form.jenjang} 
                className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-[#800000]/10"
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
                value={form.fakultas} 
                placeholder="FAKULTAS" 
                required 
                className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-[#800000]/10 outline-none" 
                onChange={e => setForm({...form, fakultas: e.target.value.toUpperCase()})} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={updating} 
            className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black uppercase shadow-lg active:scale-95 disabled:bg-gray-400 mt-6"
          >
            {updating ? "SEDANG MENGUPDATE..." : "UPDATE DATA PRODI"}
          </button>
        </form>
      </div>
    </div>
  );
}