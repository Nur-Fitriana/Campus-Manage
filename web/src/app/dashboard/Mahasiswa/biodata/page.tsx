"use client";

import { useState, useEffect, ReactNode } from "react";
import { User, MapPin, Phone, Mail, Calendar, Hash, GraduationCap, BookOpen } from "lucide-react";

// Interface sesuai field Prisma
interface UserData {
  namaLengkap: string;
  npm: string;
  prodi: string;
  fakultas: string;
  email: string;
  noTelepon: string;
  alamat: string;
  tempatLahir: string;
  tanggalLahir: string;
  status: string;
}

export default function BiodataPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // AMBIL DENGAN NAMA YANG SAMA SEPERTI DI LOGIN PAGE
      const token = localStorage.getItem("user_token");
      
      if (!token) {
        console.error("Token tidak ditemukan di localStorage");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/mahasiswa/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Gagal mengambil data dari server");
        
        const data = await res.json();

        setUser({
          namaLengkap: data.namaLengkap || "-",
          npm: data.npm || "-",
          prodi: data.programStudi?.nama || "-",
          fakultas: data.programStudi?.fakultas || "-",
          email: data.email || "-",
          noTelepon: data.noTelepon || "-",
          alamat: data.alamat || "-",
          tempatLahir: data.tempatLahir || "-",
          tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir).toLocaleDateString('id-ID') : "-",
          status: data.status || "AKTIF"
        });
      } catch (err) {
        console.error("Error Fetching:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-8 text-center text-xs font-bold">LOADING DATA...</div>;
  if (!user) return <div className="p-8 text-center text-red-500 font-bold tracking-tighter uppercase text-xs">Gagal Memuat Profil. Silakan Login Ulang.</div>;

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      {/* Tampilan biodata yang sudah kita buat sebelumnya */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
        <div className="bg-[#f8f9fa] px-6 py-3 border-b border-gray-200 flex items-center gap-2">
          <User size={16} className="text-[#800000]" />
          <h2 className="text-[#800000] font-bold text-[12px] uppercase tracking-wider">Biodata Lengkap Mahasiswa</h2>
        </div>
        <div className="p-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Nama Lengkap" value={user.namaLengkap} />
              <InfoItem label="NPM" value={user.npm} icon={<Hash size={12}/>} />
              <InfoItem label="Program Studi" value={user.prodi} icon={<BookOpen size={12}/>} />
              <InfoItem label="Email" value={user.email} icon={<Mail size={12}/>} />
              <InfoItem label="Alamat" value={user.alamat} icon={<MapPin size={12}/>} />
           </div>
        </div>
      </div>
    </div>
  );
}

// Komponen Pendukung
function InfoItem({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-1">
        {icon} {label}
      </label>
      <div className="text-[11px] font-semibold py-1.5 px-3 border border-gray-50 rounded-sm bg-gray-50 text-gray-700">
        {value}
      </div>
    </div>
  );
}