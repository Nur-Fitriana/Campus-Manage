"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, User, IdCard, Mail, MapPin, Phone, ChevronDown, GraduationCap, Users, Calendar, Hash } from "lucide-react";
import Link from "next/link";

interface ProgramStudi {
  id: string;
  nama: string;
}

interface Dosen {
  id: string;
  namaLengkap: string;
}

export default function TambahMahasiswaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [prodis, setProdis] = useState<ProgramStudi[]>([]);
  const [dosens, setDosens] = useState<Dosen[]>([]);

  // State Form untuk data baru
  const [form, setForm] = useState({
    npm: "",
    namaLengkap: "",
    email: "",
    noTelepon: "",
    alamat: "",
    jenisKelamin: "", // Tambahan wajib untuk data baru
    tanggalLahir: "",  // Tambahan wajib untuk data baru
    angkatan: new Date().getFullYear().toString(),
    programStudiId: "",
    dosenWaliId: ""
  });

  // FETCH OPTIONS (PRODI & DOSEN)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [resP, resD] = await Promise.all([
          fetch(`http://localhost:3004/api/dashboard/admin/program-studi`),
          fetch(`http://localhost:3004/api/dashboard/admin/dosen`)
        ]);
        const dataP = await resP.json();
        const dataD = await resD.json();
        
        if (dataP.success) setProdis(dataP.data);
        if (dataD.success) setDosens(dataD.data);
      } catch (e) {
        console.error("Gagal ambil opsi:", e);
      }
    };
    fetchOptions();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validasi Sederhana
    if (!form.programStudiId || !form.jenisKelamin) {
      alert("❌ Mohon pilih Program Studi dan Jenis Kelamin!");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3004/api/dashboard/admin/mahasiswa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ Mahasiswa Berhasil Ditambahkan!");
        router.push("/dashboard/admin/mahasiswa");
        router.refresh();
      } else {
        alert("Gagal simpan: " + (result.message || "Terjadi kesalahan"));
      }
    } catch (err) {
      alert("Gagal menghubungkan ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-4 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl border border-white p-6 md:p-8 text-left">

        <Link href="/dashboard/admin/mahasiswa" className="inline-flex items-center gap-2 mb-4 text-gray-400 hover:text-[#800000] font-bold text-[9px] uppercase tracking-widest transition-all">
          <ArrowLeft size={16} /> Kembali Ke Daftar
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-[900] italic uppercase text-[#800000] tracking-tighter leading-none">
            Tambah Mahasiswa Baru
          </h1>
          <div className="h-1 w-10 bg-[#800000] mt-2 rounded-full"></div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          {/* NPM */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><IdCard size={10} className="text-[#800000]" /> NPM</label>
            <input
              required
              placeholder="Masukkan NPM..."
              value={form.npm}
              onChange={e => setForm({ ...form, npm: e.target.value.replace(/\D/g, "") })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
            />
          </div>

          {/* NAMA LENGKAP */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><User size={10} className="text-[#800000]" /> Nama Lengkap</label>
            <input
              required
              placeholder="Nama Lengkap..."
              value={form.namaLengkap}
              onChange={e => setForm({ ...form, namaLengkap: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
            />
          </div>

          {/* PROGRAM STUDI */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><GraduationCap size={10} className="text-[#800000]" /> Program Studi</label>
            <div className="relative">
              <select
                required
                value={form.programStudiId}
                onChange={e => setForm({ ...form, programStudiId: e.target.value })}
                className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs appearance-none outline-none cursor-pointer"
              >
                <option value="">Pilih Program Studi</option>
                {prodis.map((p) => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* JENIS KELAMIN */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Users size={10} className="text-[#800000]" /> Jenis Kelamin</label>
            <div className="relative">
              <select
                required
                value={form.jenisKelamin}
                onChange={e => setForm({ ...form, jenisKelamin: e.target.value })}
                className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs appearance-none outline-none cursor-pointer"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="LAKI_LAKI">LAKI-LAKI</option>
                <option value="PEREMPUAN">PEREMPUAN</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* ANGKATAN & TANGGAL LAHIR */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-gray-400 ml-1 flex items-center gap-2"><Hash size={10} /> Angkatan</label>
              <input 
                type="number" 
                value={form.angkatan} 
                onChange={e => setForm({ ...form, angkatan: e.target.value })} 
                className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:bg-white transition-all font-bold text-xs outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-gray-400 ml-1 flex items-center gap-2"><Calendar size={10} /> Tgl Lahir</label>
              <input 
                required 
                type="date" 
                value={form.tanggalLahir} 
                onChange={e => setForm({ ...form, tanggalLahir: e.target.value })} 
                className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:bg-white transition-all font-bold text-xs outline-none" 
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Mail size={10} className="text-[#800000]" /> Email</label>
            <input
              type="email"
              placeholder="Email Mahasiswa..."
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
            />
          </div>

          {/* TELEPON */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Phone size={10} className="text-[#800000]" /> No. Telepon</label>
            <input
              placeholder="0812..."
              value={form.noTelepon}
              onChange={e => setForm({ ...form, noTelepon: e.target.value.replace(/\D/g, "") })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
            />
          </div>

          {/* DOSEN WALI */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Users size={10} className="text-[#800000]" /> Dosen Wali</label>
            <div className="relative">
              <select
                value={form.dosenWaliId}
                onChange={e => setForm({ ...form, dosenWaliId: e.target.value })}
                className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs appearance-none outline-none cursor-pointer"
              >
                <option value="">Pilih Dosen Wali (Opsional)</option>
                {dosens.map((d) => (
                  <option key={d.id} value={d.id}>{d.namaLengkap}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* ALAMAT */}
          <div className="space-y-1 md:col-span-2">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><MapPin size={10} className="text-[#800000]" /> Alamat</label>
            <textarea
              placeholder="Alamat Lengkap..."
              value={form.alamat}
              onChange={e => setForm({ ...form, alamat: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none h-20 resize-none"
            />
          </div>

          {/* TOMBOL SAVE */}
          <div className="md:col-span-2 pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-[#800000] hover:bg-black text-white py-3.5 rounded-xl font-[900] uppercase text-[9px] tracking-[0.4em] transition-all flex items-center justify-center gap-3 disabled:bg-gray-400"
            >
              <Save size={16} /> {isSubmitting ? "MENYIMPAN DATA..." : "SIMPAN MAHASISWA BARU"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}