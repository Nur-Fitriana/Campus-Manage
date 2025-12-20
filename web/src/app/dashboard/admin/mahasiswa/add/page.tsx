"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Phone,
  ChevronDown,
  BookOpen,
  Hash,
  Calendar,
  Users
} from "lucide-react";
import Link from "next/link";

export default function TambahMahasiswa() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [daftarProdi, setDaftarProdi] = useState<{ id: string, nama: string }[]>([]);

  const [form, setForm] = useState({
    npm: "",
    namaLengkap: "",
    email: "",
    noTelepon: "",
    alamat: "",
    jenisKelamin: "", // Kosongkan agar user memilih
    tanggalLahir: "",
    angkatan: new Date().getFullYear().toString(),
    programStudiId: ""
  });

  // --- 1. AMBIL DAFTAR PRODI OTOMATIS (Sama seperti Dosen) ---
  useEffect(() => {
    const fetchProdi = async () => {
      try {
        const res = await fetch("http://localhost:3004/api/dashboard/admin/program-studi");
        const result = await res.json();
        if (result.success) {
          setDaftarProdi(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data Program Studi:", error);
      }
    };
    fetchProdi();
  }, []);

  // --- 2. FUNGSI SIMPAN (doSave) ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validasi Field Penting
      if (!form.programStudiId || !form.jenisKelamin || !form.tanggalLahir) {
        alert("❌ Lengkapi Program Studi, Jenis Kelamin, dan Tanggal Lahir!");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ...form,
        angkatan: parseInt(form.angkatan),
        // Pastikan format tanggal disukai database
        tanggalLahir: new Date(form.tanggalLahir).toISOString(),
      };

      const res = await fetch("http://localhost:3004/api/dashboard/admin/mahasiswa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ Mahasiswa Berhasil Ditambahkan!");
        router.push("/dashboard/admin/mahasiswa");
        router.refresh();
      } else {
        alert("❌ Gagal: " + (result.message || "Periksa data kamu"));
      }
    } catch (error) {
      alert("❌ Koneksi Gagal! Pastikan Backend 3004 Jalan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-6 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 md:p-12">

        <Link href="/dashboard/admin/mahasiswa" className="inline-flex items-center gap-2 mb-8 text-gray-400 hover:text-[#800000] font-bold text-xs uppercase tracking-widest transition-all">
          <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-black italic uppercase text-[#800000] tracking-tighter leading-none">
            Tambah Mahasiswa Baru
          </h1>
          <div className="h-1.5 w-20 bg-[#800000] mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] ml-1">
              <Hash size={14} className="text-[#800000]" /> NPM
            </label>
            <input required value={form.npm} onChange={e => setForm({ ...form, npm: e.target.value.replace(/\D/g, "") })} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#800000]/20 outline-none font-bold text-sm shadow-sm" placeholder="Contoh: 23312..." />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] ml-1">
              <User size={14} className="text-[#800000]" /> Nama Lengkap
            </label>
            <input required value={form.namaLengkap} onChange={e => setForm({ ...form, namaLengkap: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#800000]/20 outline-none font-bold text-sm shadow-sm" placeholder="Nama Lengkap..." />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] ml-1">
              <BookOpen size={14} className="text-[#800000]" /> Program Studi
            </label>
            <div className="relative">
              <select required value={form.programStudiId} onChange={e => setForm({ ...form, programStudiId: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#800000]/20 outline-none font-bold text-sm appearance-none cursor-pointer shadow-sm">
                <option value="">Pilih Program Studi</option>
                {daftarProdi.map((prodi) => (
                  <option key={prodi.id} value={prodi.id}>{prodi.nama}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] ml-1">
              <Users size={14} className="text-[#800000]" /> Jenis Kelamin
            </label>
            <div className="relative">
              <select required value={form.jenisKelamin} onChange={e => setForm({ ...form, jenisKelamin: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#800000]/20 outline-none font-bold text-sm appearance-none cursor-pointer shadow-sm">
                <option value="" disabled hidden>Pilih Jenis Kelamin</option>
                <option value="LAKI_LAKI">Laki-laki</option>
                <option value="PEREMPUAN">Perempuan</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-1 flex items-center gap-2"><Hash size={12} /> Angkatan</label>
              <input type="number" value={form.angkatan} onChange={e => setForm({ ...form, angkatan: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent outline-none font-bold text-sm shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-1 flex items-center gap-2"><Calendar size={12} /> Tgl Lahir</label>
              <input required type="date" value={form.tanggalLahir} onChange={e => setForm({ ...form, tanggalLahir: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm shadow-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] ml-1">
              <Mail size={14} className="text-[#800000]" /> Email Akademik
            </label>
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm shadow-sm" placeholder="email@student.com" />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 ml-1">
              <Phone size={14} className="text-[#800000]" /> Nomor WhatsApp
            </label>
            <input type="text" value={form.noTelepon} onChange={e => setForm({ ...form, noTelepon: e.target.value.replace(/\D/g, "") })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm shadow-sm" placeholder="0812..." />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 ml-1"><MapPin size={14} className="text-[#800000]" /> Alamat Lengkap</label>
            <input value={form.alamat} onChange={e => setForm({ ...form, alamat: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm shadow-sm" placeholder="Jl. Contoh..." />
          </div>

          <div className="md:col-span-2 pt-6">
            <button type="submit" disabled={isSubmitting} className="w-full bg-[#800000] hover:bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.5em] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 disabled:opacity-50">
              <Save size={20} />
              {isSubmitting ? "PROSES MENYIMPAN..." : "SIMPAN DATA MAHASISWA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 