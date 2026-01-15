"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft, User, IdCard, Mail, Briefcase, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function EditDosenPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug; // NIP dari URL

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk menampung data agar langsung muncul di input
  const [form, setForm] = useState({
    nip: "",
    namaLengkap: "",
    email: "",
    jabatan: ""
  });

  // FUNGSI AUTO-FILL: Mengambil data lama saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data berdasarkan NIP (slug)
        const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${slug}`);
        const json = await res.json();

        if (json.success) {
          // CEK DI SINI: Jika di Mahasiswa pakai json.mahasiswa, 
          // maka di Dosen kemungkinan pakai json.dosen atau json.data
          const dataDosen = json.dosen || json.data;

          setForm({
            namaLengkap: dataDosen.namaLengkap || dataDosen.nama_dosen || "",
            nip: dataDosen.nip || "",
            email: dataDosen.email || "",
            jabatan: dataDosen.jabatan || ""
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
      const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if ((await res.json()).success) {
        alert("✅ Perubahan Berhasil Disimpan!");
        router.push("/dashboard/admin/dosen");
        router.refresh();
      }
    } catch (err) { alert("Gagal update data"); } finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="p-10 font-black text-[#800000] italic animate-pulse">MEMUAT DATA...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-4 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl border border-white p-6 md:p-8 text-left">

        <Link href="/dashboard/admin/dosen" className="inline-flex items-center gap-2 mb-4 text-gray-400 hover:text-[#800000] font-bold text-[9px] uppercase tracking-widest transition-all">
          <ArrowLeft size={12} /> Kembali ke Daftar
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-[900] italic uppercase text-[#800000] tracking-tighter leading-none">
            Edit Profile Dosen
          </h1>
          <div className="h-1 w-10 bg-[#800000] mt-2 rounded-full"></div>
          <p className="text-gray-400 font-bold text-[8px] uppercase tracking-[0.2em] mt-2">
            NIP: <span className="text-black">{slug}</span>
          </p>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

          {/* Input NIP - Langsung Terisi Data Lama */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><IdCard size={10} className="text-[#800000]" /> NIP</label>
            <input
              value={form.nip}
              onChange={e => setForm({ ...form, nip: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
            />
          </div>

          {/* Input Nama - Langsung Terisi Nama Lama */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><User size={10} className="text-[#800000]" /> Nama Lengkap</label>
            <input
              value={form.namaLengkap}
              onChange={e => setForm({ ...form, namaLengkap: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
              required
            />
          </div>

          {/* Input Jabatan - Langsung Terpilih Sesuai Database */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Briefcase size={10} className="text-[#800000]" /> Jabatan</label>
            <div className="relative">
              <select
                value={form.jabatan}
                onChange={e => setForm({ ...form, jabatan: e.target.value })}
                className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs appearance-none outline-none cursor-pointer"
              >
                <option value="">Pilih Jabatan</option>
                <option value="Asisten Ahli">Asisten Ahli</option>
                <option value="Lektor">Lektor</option>
                <option value="Lektor Kepala">Lektor Kepala</option>
                <option value="Guru Besar">Guru Besar</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1"><Mail size={10} className="text-[#800000]" /> Email</label>
            <input
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 bg-gray-50/50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all font-bold text-xs outline-none"
            />
          </div>

          {/* Tombol Simpan */}
          <div className="md:col-span-2 pt-2">
            <button type="submit" disabled={isSubmitting} className="w-full bg-[#800000] hover:bg-black text-white py-3.5 rounded-xl font-[900] uppercase text-[9px] tracking-[0.4em] transition-all flex items-center justify-center gap-3">
              <Save size={16} /> {isSubmitting ? "MEMPROSES..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}