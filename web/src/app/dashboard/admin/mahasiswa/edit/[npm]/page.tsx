"use client";
import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft, User, Mail, MapPin, Phone, Activity, ChevronDown, BookOpen } from "lucide-react";
import Link from "next/link";

export default function EditMahasiswa() {
  const params = useParams();
  const npm = params?.npm as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    namaLengkap: "",
    status: "AKTIF",
    alamat: "",
    email: "",
    noTelepon: "",
    programStudiId: "" // Field Jurusan
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3004/api/dashboard/admin/mahasiswa/${npm}`);
        const json = await res.json();
        if (json.success) setForm({
          namaLengkap: json.mahasiswa.namaLengkap || "",
          status: json.mahasiswa.status || "AKTIF",
          alamat: json.mahasiswa.alamat || "",
          email: json.mahasiswa.email || "",
          noTelepon: json.mahasiswa.noTelepon || "",
          programStudiId: json.mahasiswa.programStudiId?.toString() || ""
        });
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    if (npm) fetchData();
  }, [npm]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3004/api/dashboard/admin/mahasiswa/${npm}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if ((await res.json()).success) {
        alert("✅ Berhasil Diperbarui!");
        router.push("/dashboard/admin/mahasiswa");
        router.refresh();
      }
    } catch (e) { alert("Error simpan"); } finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="p-10 font-black text-[#800000]">LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-4 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl border border-white p-6 md:p-8">
        
        <Link href="/dashboard/admin/mahasiswa" className="inline-flex items-center gap-2 mb-4 text-gray-400 hover:text-[#800000] font-bold text-[9px] uppercase tracking-widest transition-all">
          <ArrowLeft size={12} /> Kembali ke Daftar
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-black italic uppercase text-[#800000] tracking-tighter leading-none">
            Edit Profile Mahasiswa
          </h1>
          <div className="h-1 w-10 bg-[#800000] mt-2 rounded-full"></div>
          <p className="text-gray-400 font-bold text-[8px] uppercase tracking-[0.2em] mt-2">
            NPM: <span className="text-black">{npm}</span>
          </p>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          {/* Nama Lengkap */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><User size={10} className="text-[#800000]"/> Nama Lengkap</label>
            <input value={form.namaLengkap} onChange={e => setForm({...form, namaLengkap: e.target.value})} className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none" required />
          </div>

          {/* Program Studi (Jurusan) */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><BookOpen size={10} className="text-[#800000]"/> Program Studi</label>
            <div className="relative">
              <select required value={form.programStudiId} onChange={e => setForm({...form, programStudiId: e.target.value})} className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs appearance-none outline-none cursor-pointer">
                <option value="">Pilih Jurusan</option>
                <option value="1">Informatika</option>
                <option value="2">Sistem Informasi</option>
                <option value="3">Teknik Komputer</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Status Akademik */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Activity size={10} className="text-[#800000]"/> Status Akademik</label>
            <div className="relative">
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs appearance-none outline-none cursor-pointer">
                <option value="AKTIF">AKTIF</option>
                <option value="NON_AKTIF">NON AKTIF</option>
                <option value="CUTI">CUTI</option>
                <option value="LULUS">LULUS</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Mail size={10} className="text-[#800000]"/> Alamat Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none" required />
          </div>

          {/* Nomor Telepon */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Phone size={10} className="text-[#800000]"/> Nomor Telepon</label>
            <input type="text" value={form.noTelepon} onChange={e => setForm({...form, noTelepon: e.target.value.replace(/\D/g, "")})} className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none" maxLength={13} />
          </div>

          {/* Alamat */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><MapPin size={10} className="text-[#800000]"/> Alamat Rumah</label>
            <textarea rows={1} value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none resize-none" />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 pt-2">
            <button type="submit" disabled={isSubmitting} className="w-full bg-[#800000] hover:bg-black text-white py-3.5 rounded-xl font-black uppercase text-[9px] tracking-[0.4em] transition-all flex items-center justify-center gap-3">
              <Save size={16} /> {isSubmitting ? "MEMPROSES..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}