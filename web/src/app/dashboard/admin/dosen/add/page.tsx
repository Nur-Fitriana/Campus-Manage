"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, User, Mail, Phone, BookOpen, Hash, ChevronDown, MapPin, Calendar, Users } from "lucide-react";
import Link from "next/link";

export default function TambahDosen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [daftarProdi, setDaftarProdi] = useState<{ id: string, nama: string }[]>([]);

  const [form, setForm] = useState({
    nip: "",
    namaLengkap: "",
    email: "",
    noTelepon: "",
    alamat: "",
    programStudiId: "",
    tanggalLahir: "",
    jenisKelamin: ""
  });

  useEffect(() => {
    const fetchProdi = async () => {
      try {
        // Tambahkan alamat lengkap port 3004
        const res = await fetch("http://localhost:3004/api/dashboard/admin/program-studi"); 
        const result = await res.json();
        
        // Pastikan struktur result.data sesuai dengan yang dikirim backend
        if (result.success) {
          setDaftarProdi(result.data);
        }
      } catch (error) {
        console.error("Gagal load prodi:", error);
      }
    };
    fetchProdi();
  }, []);

  // --- FUNGSI HANDLE SUBMIT (Utama) ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Menghentikan refresh halaman
    setIsSubmitting(true);

    try {
      // Validasi: Pastikan data penting tidak kosong
      if (!form.programStudiId || !form.tanggalLahir) {
        alert("❌ Program Studi dan Tanggal Lahir wajib diisi!");
        setIsSubmitting(false);
        return;
      }

      // PROSES KIRIM KE BACKEND PORT 3004
      const res = await fetch("http://localhost:3004/api/dashboard/admin/dosen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // Mengubah tanggal ke format ISO (Wajib untuk Prisma)
          tanggalLahir: new Date(form.tanggalLahir).toISOString(),
          userId: "1" // Sesuaikan dengan sistem login kamu
        })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("✅ BERHASIL: Data telah masuk ke database!");
        router.push("/dashboard/admin/dosen");
        router.refresh();
      } else {
        // Tampilkan pesan error dari backend
        alert("❌ GAGAL: " + (result.message || "Cek isian atau koneksi database"));
        console.log("Error Detail:", result);
      }
    } catch (error) {
      alert("❌ ERROR: Pastikan server di port 3004 sudah dinyalakan!");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 md:p-12">

        <Link href="/dashboard/admin/dosen" className="inline-flex items-center gap-2 mb-8 text-gray-400 hover:text-[#800000] font-bold text-xs uppercase tracking-widest transition-all">
          <ArrowLeft size={16} /> Kembali
        </Link>

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black italic uppercase text-[#800000] tracking-tighter">Tambah Dosen Baru</h1>
          <div className="h-1.5 w-20 bg-[#800000] mt-4 rounded-full mx-auto md:mx-0"></div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] ml-1">
              <Hash size={14} className="text-[#800000]" /> NIP
            </label>
            <input required value={form.nip} onChange={e => setForm({ ...form, nip: e.target.value.replace(/\D/g, "") })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm shadow-sm focus:bg-white border-2 border-transparent focus:border-red-100 transition-all" placeholder="0210..." />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] ml-1">
              <User size={14} className="text-[#800000]" /> Nama Lengkap
            </label>
            <input required value={form.namaLengkap} onChange={e => setForm({ ...form, namaLengkap: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm shadow-sm focus:bg-white border-2 border-transparent focus:border-red-100 transition-all" placeholder="Nama & Gelar..." />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] ml-1">
              <Users size={14} className="text-[#800000]" /> Jenis Kelamin
            </label>
            <div className="relative">
              <select required value={form.jenisKelamin} onChange={e => setForm({ ...form, jenisKelamin: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer shadow-sm">
                <option value="" disabled hidden>Pilih Jenis Kelamin</option>
                <option value="LAKI_LAKI">Laki-laki</option>
                <option value="PEREMPUAN">Perempuan</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] ml-1">
              <Calendar size={14} className="text-[#800000]" /> Tanggal Lahir
            </label>
            <input required type="date" value={form.tanggalLahir} onChange={e => setForm({ ...form, tanggalLahir: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm shadow-sm focus:bg-white border-2 border-transparent focus:border-red-100 transition-all" />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] ml-1">
              <BookOpen size={14} className="text-[#800000]" /> Program Studi
            </label>
            <div className="relative">
              <select required value={form.programStudiId} onChange={e => setForm({ ...form, programStudiId: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer shadow-sm">
                <option value="">-- Pilih Jurusan --</option>
                {daftarProdi.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] ml-1">
              <Mail size={14} className="text-[#800000]" /> Email Resmi
            </label>
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm shadow-sm" placeholder="dosen@teknokrat.ac.id" />
          </div>

          <div className="md:col-span-2 pt-6">
            <button type="submit" disabled={isSubmitting} className="w-full bg-[#800000] hover:bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.5em] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 disabled:opacity-50">
              <Save size={20} />
              {isSubmitting ? "PROSES MENYIMPAN..." : "SIMPAN DATA DOSEN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}