"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, User, IdCard, Mail } from "lucide-react";
import Link from "next/link";

export default function EditDosenPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    nip: "", nidn: "", namaLengkap: "", email: "", jabatan: "",
    tempatLahir: "", tanggalLahir: "", noTelepon: "", alamat: "",
    pendidikan: "", jenisKelamin: "LAKI_LAKI"
  });

  // Fetch data saat halaman dimuat
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${slug}`);
        const result = await res.json();

        if (result.success && result.data) {
          const d = result.data;
          setForm({
            nip: d.nip || "",
            nidn: d.nidn || "",
            namaLengkap: d.namaLengkap || "",
            email: d.email || "",
            jabatan: d.jabatan || "",
            tempatLahir: d.tempatLahir || "",
            tanggalLahir: d.tanggalLahir ? d.tanggalLahir.split("T")[0] : "",
            noTelepon: d.noTelepon || "",
            alamat: d.alamat || "",
            pendidikan: d.pendidikan || "",
            jenisKelamin: d.jenisKelamin || "LAKI_LAKI"
          });
        }
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
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
        alert("✅ Data Dosen Berhasil Diperbarui!");
        router.push("/dashboard/admin/dosen");
        router.refresh();
      } else {
        alert("❌ Gagal: " + result.message);
      }
    } catch (err) {
      alert("❌ Terjadi kesalahan koneksi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black italic animate-pulse text-[#800000]">LOADING DATA DOSEN...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-xl border border-white">
        <Link href="/dashboard/admin/dosen" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#800000] font-bold text-[10px] uppercase tracking-widest mb-8 transition-all">
          <ArrowLeft size={14} /> Kembali ke Database
        </Link>

        <h1 className="text-3xl font-[900] italic uppercase text-[#800000] tracking-tighter mb-8 leading-none border-b pb-6">
          Edit Profil Dosen
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
              <IdCard size={12} className="text-[#800000]" /> NIP (Nomor Induk Pegawai)
            </label>
            <input 
              value={form.nip} 
              disabled 
              className="w-full p-4 bg-gray-100 rounded-2xl border-none text-sm font-bold text-gray-500 cursor-not-allowed outline-none" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
              <User size={12} className="text-[#800000]" /> Nama Lengkap & Gelar
            </label>
            <input 
              value={form.namaLengkap} 
              onChange={(e) => setForm({...form, namaLengkap: e.target.value})} 
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all text-sm font-bold outline-none" 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
              <Mail size={12} className="text-[#800000]" /> Email Instansi
            </label>
            <input 
              type="email"
              value={form.email} 
              onChange={(e) => setForm({...form, email: e.target.value})} 
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white transition-all text-sm font-bold outline-none" 
            />
          </div>

          <div className="md:col-span-2 pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#800000] hover:bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.4em] transition-all shadow-lg shadow-[#800000]/20 disabled:opacity-50"
            >
              {isSubmitting ? "Sedang Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}