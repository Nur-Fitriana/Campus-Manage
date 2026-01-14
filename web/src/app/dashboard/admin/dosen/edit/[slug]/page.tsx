"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function EditDosenPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string; // Mengambil NIP dari URL

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    namaLengkap: "",
    email: "",
    programStudiId: "",
    jenisKelamin: "",
    tanggalLahir: ""
  });

  // Ambil data awal dari API Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${slug}`);
        const json = await res.json();
        if (json.success) {
          setForm({
            ...json.data,
            tanggalLahir: json.data.tanggalLahir ? json.data.tanggalLahir.split("T")[0] : ""
          });
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    if (slug) fetchData();
  }, [slug]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (result.success) {
        alert("Data Berhasil Diperbarui!");
        router.push("/dashboard/admin/dosen");
      }
    } catch (err) { alert("Gagal mengupdate data"); }
  };

  if (loading) return <div className="p-10 text-center font-bold">Memuat Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <Link href="/dashboard/admin/dosen" className="text-xs font-bold text-gray-400 mb-6 flex items-center gap-2">
          <ArrowLeft size={14}/> KEMBALI
        </Link>
        <h1 className="text-2xl font-black italic uppercase text-[#800000] mb-8">Edit Profil Dosen</h1>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400">Nama Lengkap</label>
            <input 
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-xs font-medium border border-transparent focus:border-red-100"
              value={form.namaLengkap}
              onChange={(e) => setForm({...form, namaLengkap: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400">Email Resmi</label>
            <input 
              type="email"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-xs font-medium border border-transparent focus:border-red-100"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-[#800000] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest mt-4">
            SIMPAN PERUBAHAN
          </button>
        </form>
      </div>
    </div>
  );
}