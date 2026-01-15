"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditDosenPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nip: "", namaLengkap: "", email: "", jabatan: "", noTelepon: "", alamat: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${slug}`);
        const result = await res.json();
        if (result.success && result.data) {
          setForm(result.data);
        } else {
          console.error("Data tidak ditemukan");
        }
      } catch (err) {
        console.error("API error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const resData = await res.json();
    if (resData.success) {
      alert("Berhasil!");
      router.push("/dashboard/admin/dosen");
    }
  };

  if (loading) return <div className="p-10 font-bold">LOADING...</div>;

  return (
    <div className="p-10">
      <Link href="/dashboard/admin/dosen" className="flex gap-2 items-center text-xs mb-5 uppercase font-bold">
        <ArrowLeft size={14}/> Kembali
      </Link>
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl border max-w-2xl">
        <h1 className="text-xl font-black italic text-[#800000] uppercase mb-5">Edit Dosen: {slug}</h1>
        <div className="flex flex-col gap-4">
          <input 
            value={form.namaLengkap} 
            onChange={(e) => setForm({...form, namaLengkap: e.target.value})} 
            className="p-3 bg-gray-50 rounded-xl outline-none" 
            placeholder="Nama Lengkap"
          />
          <input 
            value={form.email} 
            onChange={(e) => setForm({...form, email: e.target.value})} 
            className="p-3 bg-gray-50 rounded-xl outline-none" 
            placeholder="Email"
          />
          <button type="submit" className="bg-[#800000] text-white p-4 rounded-xl font-bold uppercase text-xs">Simpan</button>
        </div>
      </form>
    </div>
  );
}