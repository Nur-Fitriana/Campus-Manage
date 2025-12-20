"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Save, 
  Info, 
  Database, 
  BookOpen, 
  Code 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mocking function filter seperti di contohmu
// Sesuaikan dengan import riil di projectmu jika ada
const filterTeks = (val: string) => val.toUpperCase().replace(/[^A-Z0-9 ]/g, "");

export default function AddProdiPage() {
  const router = useRouter();

  // State Form
  const [formKode, setFormKode] = useState("");
  const [formNama, setFormNama] = useState("");

  // State Error Validation
  const [error, setError] = useState({
    kode: false,
    nama: false,
  });

  // Fungsi Simpan Data
  const saveData = async () => {
    // Validasi
    const errorStatus = {
      kode: formKode.trim() === "",
      nama: formNama.trim() === "",
    };

    setError(errorStatus);

    if (errorStatus.kode || errorStatus.nama) {
      toast.error("Mohon lengkapi seluruh data!");
      return;
    }

    try {
      // Sesuaikan URL API dengan port backendmu (3004)
      const response = await axios.post("http://localhost:3004/api/dashboard/admin/program-studi", {
        kode: formKode,
        nama: formNama,
      });

      if (response.data.success) {
        toast.success("Program Studi Berhasil Ditambahkan!");
        router.push("/dashboard/admin/program-studi");
      } else {
        toast.error(response.data.message || "Gagal menyimpan data");
      }
    } catch (err) {
      toast.error("Gagal terhubung ke server!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <title>Tambah Program Studi | Campus Manage</title>

      {/* Header Halaman */}
      <div className="flex items-center gap-4 mb-10">
        <Button 
          variant="ghost" 
          className="rounded-full w-12 h-12 p-0 hover:bg-red-50 hover:text-[#800000]"
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter leading-none">
            Tambah <span className="text-[#800000]">Prodi</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Input Struktur Akademik Baru</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
        
        {/* Input Kode Prodi */}
        <section className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Code size={14} className="text-[#800000]" /> Kode Program Studi
          </Label>
          <Input
            className="h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#800000]/20 font-bold text-slate-700"
            placeholder="Contoh: IF, SI, AK..."
            maxLength={5}
            value={formKode}
            onChange={(e) => setFormKode(filterTeks(e.target.value))}
          />
          {error.kode && (
            <p className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1 mt-1 italic">
              <Info size={12} /> Kode Prodi wajib diisi!
            </p>
          )}
        </section>

        {/* Input Nama Prodi */}
        <section className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <BookOpen size={14} className="text-[#800000]" /> Nama Program Studi
          </Label>
          <Input
            className="h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-[#800000]/20 font-bold text-slate-700"
            placeholder="Contoh: Informatika..."
            value={formNama}
            onChange={(e) => setFormNama(e.target.value)}
          />
          {error.nama && (
            <p className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1 mt-1 italic">
              <Info size={12} /> Nama Prodi wajib diisi!
            </p>
          )}
        </section>

        {/* Tombol Aksi */}
        <div className="flex gap-4 pt-6">
          <Button
            className="flex-1 h-14 rounded-2xl bg-[#800000] hover:bg-black text-white font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-red-900/20 gap-2"
            onClick={saveData}
          >
            <Save size={18} /> Simpan Data
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-2 border-slate-100 font-black uppercase tracking-widest text-[11px] text-slate-400 hover:bg-slate-50 transition-all"
            onClick={() => router.push("/dashboard/admin/program-studi")}
          >
            Batal
          </Button>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="mt-10 flex flex-col items-center opacity-20">
        <Database size={40} className="text-slate-300" />
        <div className="h-10 w-[1px] bg-slate-300 mt-2"></div>
      </div>
    </div>
  );
}