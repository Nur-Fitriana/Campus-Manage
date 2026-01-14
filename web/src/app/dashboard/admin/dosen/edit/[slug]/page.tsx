"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft, User, IdCard, MapPin, Phone, Briefcase, Mail, Calendar, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function EditDosenPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug; // Slug awal (NIP lama) untuk pencarian API

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    nip: "",
    namaLengkap: "",
    email: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    noTelepon: "",
    jabatan: ""
  });

  useEffect(() => {
    const loadDosen = async () => {
      try {
        const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${slug}`);
        const json = await res.json();
        
        if (json.success) {
          const d = json.data;
          // Data lama langsung dimasukkan ke state agar muncul di input
          setForm({
            nip: d.nip || "",
            namaLengkap: d.namaLengkap || "",
            email: d.email || "",
            tempatLahir: d.tempatLahir || "",
            tanggalLahir: d.tanggalLahir ? d.tanggalLahir.split("T")[0] : "",
            alamat: d.alamat || "",
            noTelepon: d.noTelepon || "",
            jabatan: d.jabatan || ""
          });
        }
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    if (slug) loadDosen();
  }, [slug]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form) // Mengirim form (termasuk NIP yang mungkin sudah diubah)
      });
      const result = await res.json();
      if (result.success) {
        alert("✅ Data Berhasil Diperbarui!");
        router.push("/dashboard/admin/dosen");
        router.refresh();
      }
    } catch (err) { 
      alert("❌ Gagal update"); 
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 font-black text-[#800000] italic">MEMUAT DATA...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-4 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl border border-white p-6 md:p-8">
        
        <Link href="/dashboard/admin/dosen" className="inline-flex items-center gap-2 mb-4 text-gray-400 hover:text-[#800000] font-bold text-[9px] uppercase tracking-widest transition-all">
          <ArrowLeft size={12} /> Kembali ke Daftar
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-black italic uppercase text-[#800000] tracking-tighter leading-none">
            Edit Profile Dosen
          </h1>
          <div className="h-1 w-10 bg-[#800000] mt-2 rounded-full"></div>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          {/* NIP - Sekarang Bisa Diedit */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><IdCard size={10} className="text-[#800000]"/> Nomor Induk Pegawai (NIP)</label>
            <input 
              value={form.nip} 
              onChange={e => setForm({...form, nip: e.target.value})}
              placeholder="Masukkan NIP Baru"
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none" 
            />
          </div>

          {/* Nama Lengkap - Sudah Terisi Nama Lama */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><User size={10} className="text-[#800000]"/> Nama Lengkap & Gelar</label>
            <input 
              value={form.namaLengkap} 
              onChange={e => setForm({...form, namaLengkap: e.target.value})} 
              placeholder="Contoh: Dr. Ridwan Mahenra, M.Cs."
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none" 
              required 
            />
          </div>

          {/* Jabatan */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Briefcase size={10} className="text-[#800000]"/> Jabatan</label>
            <div className="relative">
              <select 
                value={form.jabatan} 
                onChange={e => setForm({...form, jabatan: e.target.value})} 
                className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs appearance-none outline-none cursor-pointer"
              >
                <option value="">Pilih Jabatan</option>
                <option value="Tenaga Pengajar">Tenaga Pengajar</option>
                <option value="Asisten Ahli">Asisten Ahli</option>
                <option value="Lektor">Lektor</option>
                <option value="Lektor Kepala">Lektor Kepala</option>
                <option value="Guru Besar">Guru Besar</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Mail size={10} className="text-[#800000]"/> Email Instansi</label>
            <input 
              type="email" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              placeholder="dosen@teknokrat.ac.id"
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none" 
              required 
            />
          </div>

          {/* Alamat */}
          <div className="space-y-1 md:col-span-2">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><MapPin size={10} className="text-[#800000]"/> Alamat Rumah</label>
            <textarea 
              rows={2} 
              value={form.alamat} 
              onChange={e => setForm({...form, alamat: e.target.value})} 
              placeholder="Jl. H. ZA. Pagar Alam No.9..."
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none resize-none" 
            />
          </div>

          {/* Tombol Simpan */}
          <div className="md:col-span-2 pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-[#800000] hover:bg-black text-white py-3.5 rounded-xl font-black uppercase text-[9px] tracking-[0.4em] transition-all flex items-center justify-center gap-3"
            >
              <Save size={16} /> {isSubmitting ? "MEMPROSES..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}