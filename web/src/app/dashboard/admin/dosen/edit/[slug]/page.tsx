"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft, User, IdCard, GraduationCap, MapPin, Phone, Briefcase, Mail, Calendar } from "lucide-react";
import Link from "next/link";

export default function EditDosenPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nip: "",
    nidn: "",
    namaLengkap: "",
    email: "",
    jenisKelamin: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    noTelepon: "",
    pendidikan: "",
    jabatan: "",
    programStudiId: ""
  });

  useEffect(() => {
    const loadDosen = async () => {
      try {
        const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${slug}`);
        const json = await res.json();
        if (json.success) {
          const d = json.data;
          setForm({
            ...d,
            // Format tanggal agar cocok dengan input type="date"
            tanggalLahir: d.tanggalLahir ? d.tanggalLahir.split("T")[0] : "",
            nidn: d.nidn || "",
            pendidikan: d.pendidikan || "",
            jabatan: d.jabatan || "",
            tempatLahir: d.tempatLahir || "",
            alamat: d.alamat || "",
            noTelepon: d.noTelepon || ""
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) loadDosen();
  }, [slug]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const yakin = confirm("Apakah Anda yakin ingin menyimpan perubahan data ini?");
    if (!yakin) return;

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
      } else {
        alert("❌ Gagal: " + result.message);
      }
    } catch (err) {
      alert("❌ Gagal koneksi ke server");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center font-black text-gray-300 animate-bounce tracking-tighter">MENGAMBIL DATA...</div>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/dashboard/admin/dosen" className="flex items-center gap-2 mb-6 text-gray-400 hover:text-[#800000] transition-colors font-bold text-xs">
        <ArrowLeft size={16} /> KEMBALI KE DAFTAR
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#800000] uppercase italic tracking-tighter">Edit Profil Pengajar</h1>
        <p className="text-gray-400 text-xs mt-1 font-medium italic">Pastikan NIP dan NIDN sesuai dengan data PDDIKTI.</p>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
        
        {/* Kolom Kiri: Identitas Utama */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <IdCard size={12}/> NIP (Identitas Utama)
            </label>
            <input 
              className="bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none text-sm focus:border-[#800000] focus:bg-white transition-all shadow-sm" 
              placeholder="Contoh: 198801012015011001"
              value={form.nip} 
              onChange={e => setForm({...form, nip: e.target.value})} 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <User size={12}/> Nama Lengkap & Gelar
            </label>
            <input 
              className="bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none text-sm focus:border-[#800000] focus:bg-white transition-all shadow-sm" 
              placeholder="Contoh: Dr. Ahmad Subarjo, S.Kom., M.T."
              value={form.namaLengkap} 
              onChange={e => setForm({...form, namaLengkap: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <Briefcase size={12}/> Jabatan
              </label>
              <input 
                className="bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none text-sm focus:border-[#800000]" 
                placeholder="Lektor Kepala"
                value={form.jabatan} 
                onChange={e => setForm({...form, jabatan: e.target.value})} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <GraduationCap size={12}/> Pendidikan
              </label>
              <input 
                className="bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none text-sm focus:border-[#800000]" 
                placeholder="S3 - Doktor"
                value={form.pendidikan} 
                onChange={e => setForm({...form, pendidikan: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <Mail size={12}/> Email Instansi
            </label>
            <input 
              type="email"
              className="bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none text-sm focus:border-[#800000]" 
              placeholder="dosen@teknokrat.ac.id"
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
          </div>
        </div>

        {/* Kolom Ranan: Data Pribadi */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <MapPin size={12}/> Tempat Lahir
              </label>
              <input 
                className="bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none text-sm focus:border-[#800000]" 
                placeholder="Bandar Lampung"
                value={form.tempatLahir} 
                onChange={e => setForm({...form, tempatLahir: e.target.value})} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <Calendar size={12}/> Tgl Lahir
              </label>
              <input 
                type="date"
                className="bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none text-sm focus:border-[#800000]" 
                value={form.tanggalLahir} 
                onChange={e => setForm({...form, tanggalLahir: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <Phone size={12}/> WhatsApp / Telepon
            </label>
            <input 
              className="bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none text-sm focus:border-[#800000]" 
              placeholder="0812xxxx"
              value={form.noTelepon} 
              onChange={e => setForm({...form, noTelepon: e.target.value})} 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <MapPin size={12}/> Alamat Lengkap
            </label>
            <textarea 
              className="bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none text-sm focus:border-[#800000] min-h-[105px] resize-none" 
              placeholder="Jl. H. ZA. Pagar Alam No.9..."
              value={form.alamat} 
              onChange={e => setForm({...form, alamat: e.target.value})} 
            />
          </div>
        </div>

        <div className="md:col-span-2 pt-4">
          <button type="submit" className="group w-full bg-[#800000] hover:bg-black text-white py-5 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-red-900/20">
            <Save size={18} className="group-hover:rotate-12 transition-transform"/> Simpan Perubahan Data
          </button>
        </div>
      </form>
    </div>
  );
}