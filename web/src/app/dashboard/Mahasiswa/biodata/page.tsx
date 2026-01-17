"use client";

import { useState, useEffect } from "react";
import { User, MapPin, Phone, Mail, Calendar, Hash, GraduationCap, BookOpen } from "lucide-react";

// 1. Definisikan struktur data agar TypeScript tidak bingung
interface UserData {
  nama: string;
  npm: string;
  prodi: string;
  fakultas: string;
  email: string;
  telepon: string;
  alamat: string;
}

function InfoItem({ label, value, icon, isStatus = false }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-1">
        {icon} {label}
      </label>
      <div className={`text-[11px] font-semibold py-1.5 px-3 border border-gray-50 rounded-sm ${
        isStatus ? "bg-green-50 text-green-700 w-fit px-4" : "bg-gray-50 text-gray-700"
      }`}>
        {value}
      </div>
    </div>
  );
}

export default function BiodataPage() {
  // 2. Terapkan interface pada useState
  const [user, setUser] = useState<UserData>({
    nama: "-",
    npm: "-",
    prodi: "S1 Informatika",
    fakultas: "Teknik dan Ilmu Komputer",
    email: "-",
    telepon: "-",
    alamat: "-",
  });

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedNPM = localStorage.getItem("userNPM");
    const savedEmail = localStorage.getItem("userEmail");

    // 3. Update state dengan semua kunci yang diwajibkan oleh interface
    setUser({
      nama: savedName || "-",
      npm: savedNPM || "-",
      prodi: "S1 Informatika",
      fakultas: "Teknik dan Ilmu Komputer",
      email: savedEmail || "-",
      telepon: "-", // Pastikan ini ada
      alamat: "Alamat belum dilengkapi dalam database.", // Pastikan ini ada
    });
  }, []);

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
        <div className="bg-[#f8f9fa] px-6 py-3 border-b border-gray-200 flex items-center gap-2">
          <User size={16} className="text-[#800000]" />
          <h2 className="text-[#800000] font-bold text-[12px] uppercase tracking-wider">
            Biodata Lengkap Mahasiswa
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 flex flex-col items-center">
              <div className="w-40 h-52 bg-gray-50 border-2 border-gray-100 rounded-sm flex flex-col items-center justify-center text-[10px] text-gray-300 font-bold uppercase p-4 text-center shadow-inner">
                <User size={40} className="mb-2 opacity-10" />
                PHOTO <br/> {user.npm}
              </div>
              <p className="mt-4 text-[10px] text-gray-400 italic">Format: Pas Foto Formal</p>
            </div>

            <div className="lg:col-span-9 space-y-6">
              <div>
                <h3 className="text-[11px] font-bold text-gray-400 uppercase border-b border-gray-100 pb-1 mb-4 flex items-center gap-2">
                  <GraduationCap size={14} /> Informasi Akademik
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="NPM / Username" value={user.npm} icon={<Hash size={12}/>} />
                  <InfoItem label="Program Studi" value={user.prodi} icon={<BookOpen size={12}/>} />
                  <InfoItem label="Fakultas" value={user.fakultas} />
                  <InfoItem label="Status Mahasiswa" value="AKTIF" isStatus />
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase border-b border-gray-100 pb-1 mb-4 flex items-center gap-2">
                  <User size={14} /> Data Pribadi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Nama Lengkap" value={user.nama} />
                  <InfoItem label="Email" value={user.email} icon={<Mail size={12}/>} />
                  <InfoItem label="No. Telepon" value={user.telepon} icon={<Phone size={12}/>} />
                  <InfoItem label="Tempat, Tanggal Lahir" value="Lampung, 01 Jan 2000" icon={<Calendar size={12}/>} />
                </div>
                <div className="mt-4">
                  <InfoItem label="Alamat Tinggal" value={user.alamat} icon={<MapPin size={12}/>} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}