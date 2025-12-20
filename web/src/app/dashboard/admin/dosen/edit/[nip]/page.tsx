"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft, User, Mail, BookOpen, Hash, ChevronDown, Calendar, Users, RefreshCw } from "lucide-react";
import Link from "next/link";

type JenisKelamin = "Laki-laki" | "Perempuan";

interface ProgramStudi {
  id: string;
  nama: string;
}

export default function EditDosen() {
  const router = useRouter();
  const params = useParams();
  // Menggunakan nip sesuai dengan folder [nip]
  const nipParam = params.nip as string;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fetchingData, setFetchingData] = useState<boolean>(true);
  const [daftarProdi, setDaftarProdi] = useState<ProgramStudi[]>([]);

  const [form, setForm] = useState({
    nip: "",
    namaLengkap: "",
    email: "",
    programStudiId: "",
    tanggalLahir: "",
    jenisKelamin: "" as JenisKelamin | ""
  });

  useEffect(() => {
    const initData = async (): Promise<void> => {
      try {
        // 1. Ambil data Program Studi
        const resProdi = await fetch("/api/dashboard/admin/program-studi");
        const jsonProdi = await resProdi.json();
        if (jsonProdi.success) setDaftarProdi(jsonProdi.data);

        // 2. Ambil data Dosen berdasarkan NIP
        const resDosen = await fetch(`/api/dashboard/admin/dosen/${nipParam}`);
        const jsonDosen = await resDosen.json();

        if (jsonDosen.success) {
          const d = jsonDosen.data;
          setForm({
            nip: d.nip,
            namaLengkap: d.namaLengkap,
            email: d.email || "",
            programStudiId: d.programStudiId || "",
            tanggalLahir: d.tanggalLahir ? d.tanggalLahir.split("T")[0] : "",
            jenisKelamin: d.jenisKelamin as JenisKelamin
          });
        }
      } catch (error: unknown) {
        console.error("Gagal load data:", error);
      } finally {
        setFetchingData(false);
      }
    };
    if (nipParam) initData();
  }, [nipParam]);

  const handleUpdate = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    const yakin = confirm("Apakah Anda yakin ingin menyimpan perubahan data dosen ini?");
    if (!yakin) return;

    setIsSubmitting(true);
    try {
      // Menggunakan NIP asli dari params untuk identifier di API
      const res = await fetch(`/api/dashboard/admin/dosen/${nipParam}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tanggalLahir: form.tanggalLahir ? new Date(form.tanggalLahir).toISOString() : null
        })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ BERHASIL: Data dosen telah diperbarui!");
        router.push("/dashboard/admin/dosen");
        router.refresh();
      } else {
        alert("❌ GAGAL: " + (result.message || "Terjadi kesalahan saat menyimpan."));
      }
    } catch (error: unknown) {
      alert("❌ ERROR: Tidak dapat terhubung ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <RefreshCw className="animate-spin text-[#800000]" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Memuat Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-8 px-6 font-sans text-gray-700">
      <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 md:p-12">
        
        <Link href="/dashboard/admin/dosen" className="inline-flex items-center gap-2 mb-8 text-gray-400 hover:text-[#800000] font-bold text-[10px] uppercase tracking-widest transition-all">
          <ArrowLeft size={14} /> KEMBALI
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-black italic uppercase text-[#800000] tracking-tighter">Edit Dosen</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">NIP: {nipParam}</p>
          <div className="h-1 w-12 bg-[#800000] mt-2 rounded-full"></div>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <Hash size={12} className="text-[#800000]"/> NIP (Tetap)
            </label>
            <input 
              readOnly
              value={form.nip} 
              className="w-full p-4 bg-gray-100 rounded-2xl outline-none font-bold text-xs shadow-sm border border-transparent text-gray-500 cursor-not-allowed" 
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <User size={12} className="text-[#800000]"/> Nama Lengkap
            </label>
            <input 
              required 
              value={form.namaLengkap} 
              onChange={e => setForm({...form, namaLengkap: e.target.value})} 
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium text-xs shadow-sm border border-transparent focus:border-red-100 focus:bg-white transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <Users size={12} className="text-[#800000]"/> Jenis Kelamin
            </label>
            <div className="relative">
              <select 
                required 
                value={form.jenisKelamin} 
                onChange={e => setForm({...form, jenisKelamin: e.target.value as JenisKelamin})} 
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium text-xs appearance-none cursor-pointer border border-transparent focus:border-red-100 transition-all uppercase"
              >
                <option value="LAKI_LAKI">LAKI-LAKI</option>
                <option value="PEREMPUAN">PEREMPUAN</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <Calendar size={12} className="text-[#800000]"/> Tanggal Lahir
            </label>
            <input 
              required 
              type="date" 
              value={form.tanggalLahir} 
              onChange={e => setForm({...form, tanggalLahir: e.target.value})} 
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium text-xs border border-transparent focus:border-red-100 transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <BookOpen size={12} className="text-[#800000]"/> Program Studi
            </label>
            <div className="relative">
              <select 
                required 
                value={form.programStudiId} 
                onChange={e => setForm({...form, programStudiId: e.target.value})} 
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium text-xs appearance-none cursor-pointer border border-transparent focus:border-red-100 transition-all uppercase"
              >
                <option value="">-- Pilih Jurusan --</option>
                {daftarProdi.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <Mail size={12} className="text-[#800000]"/> Email Resmi
            </label>
            <input 
              required 
              type="email" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium text-xs border border-transparent focus:border-red-100 transition-all" 
            />
          </div>

          <div className="md:col-span-2 pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-[#800000] hover:bg-black text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] transition-all flex items-center justify-center gap-3 shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
              {isSubmitting ? "MEMPROSES..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}