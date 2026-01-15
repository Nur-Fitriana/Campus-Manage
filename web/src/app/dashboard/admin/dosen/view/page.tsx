"use client";

import { useEffect, useState, use } from "react"; // Tambahkan 'use'
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, BookOpen, BadgeCheck, Phone } from "lucide-react";
import Link from "next/link";

interface Dosen {
  nidn: string;
  namaLengkap: string;
  email: string;
  noTelepon?: string;
  status: string;
  programStudiId: string;
  programStudi?: { nama: string };
}

// Tambahkan tipe params sebagai Promise
export default function ViewDetailDosen({ params }: { params: Promise<{ nip: string }> }) {
  // UNWRAP PARAMS
  const resolvedParams = use(params);
  const nip = resolvedParams.nip; 
  
  const router = useRouter();
  const [dosen, setDosen] = useState<Dosen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDosen = async () => {
      // Guard Clause agar tidak fetch jika nip undefined
      if (!nip || nip === "undefined") return;

      try {
        setLoading(true);
        // Pastikan URL API sesuai dengan folder [slug] di backend
        const res = await fetch(`http://localhost:3004/api/dashboard/admin/dosen/${nip}`, {
          cache: "no-store"
        });
        const json = await res.json();
        
        if (json.success) {
          setDosen(json.data);
        }
      } catch (err) {
        console.error("Gagal mengambil detail dosen", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDosen();
  }, [nip]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
      <div className="p-10 font-black text-[#800000] animate-pulse italic text-xl">
        MEMUAT DATA DOSEN...
      </div>
    </div>
  );

  if (!dosen) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center font-bold">Data dosen tidak ditemukan.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 mb-6 text-gray-400 hover:text-[#800000] font-black uppercase text-[10px] tracking-widest transition-all"
        >
          <ArrowLeft size={14} /> Kembali ke Daftar
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="h-32 bg-[#800000] w-full" />
          <div className="px-8 pb-10 -mt-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-white">
                <div className="w-full h-full bg-gray-50 rounded-2xl flex items-center justify-center text-[#800000]">
                  <User size={48} />
                </div>
              </div>

              <div className="flex-1 mt-16 md:mt-20">
                <h1 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter">
                  {dosen.namaLengkap}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                   <BadgeCheck size={16} className="text-[#800000]" />
                   <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Dosen Tetap</span>
                </div>
              </div>

              <div className="mt-16 md:mt-20">
                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${
                  dosen.status === "AKTIF" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {dosen.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">NIDN / NIP</label>
                  <p className="font-bold text-gray-800 mt-1">{dosen.nidn}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Program Studi</label>
                  <div className="flex items-center gap-2 mt-1 text-gray-800">
                    <BookOpen size={16} className="text-[#800000]" />
                    <p className="font-bold">{dosen.programStudi?.nama || "Tidak ada data prodi"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Akademik</label>
                  <div className="flex items-center gap-2 mt-1 text-gray-800">
                    <Mail size={16} className="text-[#800000]" />
                    <p className="font-bold">{dosen.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp / Telepon</label>
                  <div className="flex items-center gap-2 mt-1 text-gray-800">
                    <Phone size={16} className="text-[#800000]" />
                    <p className="font-bold">{dosen.noTelepon || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}