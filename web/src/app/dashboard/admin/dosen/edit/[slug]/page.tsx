"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Save, ArrowLeft, User, IdCard, Mail, Briefcase, 
  ChevronDown, MapPin, Phone, Calendar, GraduationCap, BookOpen 
} from "lucide-react";
import Link from "next/link";

// Definisi Interface agar tidak ada 'any'
interface DosenForm {
  nip: string;
  nidn: string;
  namaLengkap: string;
  email: string;
  jabatan: string;
  tempatLahir: string;
  tanggalLahir: string;
  noTelepon: string;
  alamat: string;
  pendidikan: string;
  programStudiId: string;
  jenisKelamin: string;
}

export default function EditDosenPage() {
  const params = useParams();
  const router = useRouter();
  
  // Memastikan slug adalah string (menghindari error Next.js 15/16)
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<DosenForm>({
    nip: "",
    nidn: "",
    namaLengkap: "",
    email: "",
    jabatan: "",
    tempatLahir: "",
    tanggalLahir: "",
    noTelepon: "",
    alamat: "",
    pendidikan: "",
    programStudiId: "",
    jenisKelamin: "LAKI_LAKI"
  });

  // 1. Fetch Data Saat Load Halaman
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      try {
        const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${slug}`);
        const json = await res.json();

        if (json.success && json.data) {
          const d = json.data;
          setForm({
            nip: d.nip ?? "",
            nidn: d.nidn ?? "",
            namaLengkap: d.namaLengkap ?? "",
            email: d.email ?? "",
            jabatan: d.jabatan ?? "",
            tempatLahir: d.tempatLahir ?? "",
            tanggalLahir: d.tanggalLahir ? d.tanggalLahir.split("T")[0] : "",
            noTelepon: d.noTelepon ?? "",
            alamat: d.alamat ?? "",
            pendidikan: d.pendidikan ?? "",
            programStudiId: d.programStudiId?.toString() ?? "",
            jenisKelamin: d.jenisKelamin ?? "LAKI_LAKI"
          });
        } else {
          console.error("Data tidak ditemukan di server");
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // 2. Fungsi Update Data (PUT)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await res.json();

      if (result.success) {
        alert("✅ Perubahan Berhasil Disimpan!");
        router.push("/dashboard/admin/dosen");
        router.refresh();
      } else {
        alert(`❌ Gagal: ${result.message || "Terjadi kesalahan sistem"}`);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("❌ Gagal menghubungi API Server (Port 3004)");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="p-10 font-black text-[#800000] italic animate-pulse text-center uppercase tracking-tighter">
          Mengambil Data dari Server...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-4 px-6 pb-10">
      <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-xl border border-white p-6 md:p-8 text-left">
        
        <Link href="/dashboard/admin/dosen" className="inline-flex items-center gap-2 mb-4 text-gray-400 hover:text-[#800000] font-bold text-[9px] uppercase tracking-widest transition-all">
          <ArrowLeft size={12} /> Kembali ke Daftar
        </Link>

        <div className="mb-6 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-[900] italic uppercase text-[#800000] tracking-tighter leading-none">
            Edit Profil Dosen
          </h1>
          <p className="text-gray-400 font-bold text-[8px] uppercase tracking-[0.2em] mt-2">
            ID DOSEN (SLUG): <span className="text-black font-black">{slug}</span>
          </p>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          
          {/* NIP - Dibuat ReadOnly karena Username di User table terikat NIP */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <IdCard size={10} className="text-[#800000]" /> NIP (ID Akun)
            </label>
            <input
              value={form.nip}
              onChange={(e) => setForm({ ...form, nip: e.target.value })}
              className="w-full p-2.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
              placeholder="Masukkan NIP..."
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <BookOpen size={10} className="text-[#800000]" /> NIDN
            </label>
            <input
              value={form.nidn}
              onChange={(e) => setForm({ ...form, nidn: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <User size={10} className="text-[#800000]" /> Nama Lengkap
            </label>
            <input
              value={form.namaLengkap}
              onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <Briefcase size={10} className="text-[#800000]" /> Jabatan
            </label>
            <div className="relative">
              <select
                value={form.jabatan}
                onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
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

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <GraduationCap size={10} className="text-[#800000]" /> Pendidikan Terakhir
            </label>
            <input
              value={form.pendidikan}
              onChange={(e) => setForm({ ...form, pendidikan: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
              placeholder="Contoh: S3 Ilmu Komputer"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <Mail size={10} className="text-[#800000]" /> Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <Calendar size={10} className="text-[#800000]" /> Tanggal Lahir
            </label>
            <input
              type="date"
              value={form.tanggalLahir}
              onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <Phone size={10} className="text-[#800000]" /> No. Telepon
            </label>
            <input
              value={form.noTelepon}
              onChange={(e) => setForm({ ...form, noTelepon: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
            />
          </div>

          <div className="space-y-1 md:col-span-3">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">
              <MapPin size={10} className="text-[#800000]" /> Alamat Domisili
            </label>
            <textarea
              rows={2}
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none resize-none"
            />
          </div>

          <div className="md:col-span-3 pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-[#800000] hover:bg-black text-white py-4 rounded-xl font-[900] uppercase text-[10px] tracking-[0.4em] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
            >
              <Save size={16} /> {isSubmitting ? "Sedang Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}