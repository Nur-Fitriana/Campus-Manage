"use client";

import { useState, useEffect } from "react";

interface UserData {
  namaLengkap: string;
  npm: string;
  prodi: string;
  fakultas: string;
  email: string;
  noTelepon: string;
  alamat: string;
}

export default function BiodataPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // Perbaikan: Ambil token satu kali saja (tidak duplikat lagi)
      const token = localStorage.getItem("user_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/mahasiswa/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Gagal mengambil data");
        
        const data = await res.json();
        
        setUser({
          namaLengkap: data.namaLengkap || "-",
          npm: data.npm || "-",
          prodi: data.programStudi?.nama || "-",
          fakultas: data.programStudi?.fakultas || "-",
          email: data.email || "-",
          noTelepon: data.noTelepon || "-",
          alamat: data.alamat || "-",
        });
      } catch (err) {
        console.error("Gagal ambil data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p className="text-center p-10 font-bold">MEMUAT...</p>;
  
  // Tampilan jika data gagal dimuat
  if (!user) return (
    <div className="flex flex-col items-center justify-center p-20">
      <p className="text-red-500 font-bold uppercase text-xs tracking-tighter">
        GAGAL MEMUAT PROFIL. SILAKAN LOGIN ULANG.
      </p>
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm rounded-sm">
        <div className="bg-[#f8f9fa] px-6 py-3 border-b border-gray-200">
          <h2 className="text-[#800000] font-bold text-[12px] uppercase tracking-wider">
            Biodata Lengkap Mahasiswa
          </h2>
        </div>
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">{user.namaLengkap}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoBox label="NPM" value={user.npm} />
            <InfoBox label="Program Studi" value={user.prodi} />
            <InfoBox label="Fakultas" value={user.fakultas} />
            <InfoBox label="Email" value={user.email} />
            <InfoBox label="No. Telepon" value={user.noTelepon} />
            <InfoBox label="Alamat" value={user.alamat} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
      <p className="text-sm font-semibold text-gray-700 border-b border-gray-50 pb-1">{value}</p>
    </div>
  );
}