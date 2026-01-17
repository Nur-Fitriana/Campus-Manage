"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft, User, IdCard, Mail, MapPin, Phone, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function EditMahasiswaPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    npm: "",
    namaLengkap: "",
    email: "",
    noTelepon: "",
    alamat: "",
    status: ""
  });

  // Tambahkan di dalam fungsi EditMahasiswaPage
const [prodis, setProdis] = useState([]);
const [dosens, setDosens] = useState([]);

// Di dalam useEffect fetchData, tambahkan ini:
useEffect(() => {
  const fetchOptions = async () => {
    try {
      // Ambil daftar prodi & dosen untuk dropdown
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

  // FUNGSI AUTO-FILL: Mengambil data lama
  useEffect(() => {
    const fetchData = async () => {
      try {
        // PERBAIKAN: Gunakan relative path untuk menghindari error Port 3004
        const res = await fetch(`http://localhost:3004/api/dashboard/admin/mahasiswa/${slug}`, {
          cache: "no-store"
        });

        const json = await res.json();

        if (json.success) {
          // Sesuaikan dengan struktur JSON yang dikembalikan API kamu
          const m = json.mahasiswa || json.data;
          setForm({
            npm: m.npm || "",
            namaLengkap: m.namaLengkap || "",
            email: m.email || "",
            noTelepon: m.noTelepon || "",
            alamat: m.alamat || "",
            status: m.status || "AKTIF"
          });
        }
      } catch (e) {
        console.error("Gagal load data:", e);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // PERBAIKAN: Gunakan relative path
      const res = await fetch(`http://localhost:3004/api/dashboard/admin/mahasiswa/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ Data Mahasiswa Berhasil Diperbarui!");
        router.push("/dashboard/admin/mahasiswa");
        router.refresh();
      } else {
        alert("Gagal update: " + (result.error || "Terjadi kesalahan"));
      }
    } catch (err) {
      alert("Gagal update data. Pastikan API Route sudah benar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
      <div className="p-10 font-black text-[#800000] italic animate-pulse text-xl">
        MEMUAT DATA MAHASISWA...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-4 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl border border-white p-6 md:p-8 text-left">

        <Link href="/dashboard/admin/mahasiswa" className="inline-flex items-center gap-2 mb-4 text-gray-400 hover:text-[#800000] font-bold text-[9px] uppercase tracking-widest transition-all">
          <ArrowLeft size={16} /> Kembali Ke Daftar
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-[900] italic uppercase text-[#800000] tracking-tighter leading-none">
            Edit Profile Mahasiswa
          </h1>
          <div className="h-1 w-10 bg-[#800000] mt-2 rounded-full"></div>
          <p className="text-gray-400 font-bold text-[8px] uppercase tracking-[0.2em] mt-2">
            NPM: <span className="text-black">{slug}</span>
          </p>
        </div>

        

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><IdCard size={10} className="text-[#800000]" /> NPM</label>
            <input
              value={form.npm}
              onChange={e => setForm({ ...form, npm: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none" // Hapus opacity-60 & cursor-not-allowed
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><User size={10} className="text-[#800000]" /> Nama Lengkap</label>
            <input
              value={form.namaLengkap}
              onChange={e => setForm({ ...form, namaLengkap: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Mail size={10} className="text-[#800000]" /> Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Phone size={10} className="text-[#800000]" /> No. Telepon</label>
            <input
              value={form.noTelepon}
              onChange={e => setForm({ ...form, noTelepon: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><MapPin size={10} className="text-[#800000]" /> Alamat</label>
            <textarea
              value={form.alamat}
              onChange={e => setForm({ ...form, alamat: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none h-20 resize-none"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">Status Mahasiswa</label>
            <div className="relative">
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs appearance-none outline-none cursor-pointer"
              >
                <option value="AKTIF">AKTIF</option>
                <option value="CUTI">CUTI</option>
                <option value="LULUS">LULUS</option>
                <option value="DROPOUT">DROPOUT</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-2 pt-2">
            <button type="submit" disabled={isSubmitting} className="w-full bg-[#800000] hover:bg-black text-white py-3.5 rounded-xl font-[900] uppercase text-[9px] tracking-[0.4em] transition-all flex items-center justify-center gap-3 disabled:bg-gray-400">
              <Save size={16} /> {isSubmitting ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}