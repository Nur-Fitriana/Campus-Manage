"use client";

import { useState, useEffect, ReactNode } from "react";

// Definisikan Interface agar Type-Safe
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
      // Ambil token satu kali saja (perbaiki duplikasi di baris 27-28 screenshot kamu)
      const token = localStorage.getItem("user_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/mahasiswa/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error();
        
        const data = await res.json();
        
        // Map data dari API ke State
        setUser({
          namaLengkap: data.namaLengkap,
          npm: data.npm,
          prodi: data.programStudi?.nama || "-",
          fakultas: data.programStudi?.fakultas || "-",
          email: data.email,
          noTelepon: data.noTelepon,
          alamat: data.alamat,
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
  if (!user) return <p className="text-center p-10 text-red-500 font-bold">GAGAL MEMUAT PROFIL. SILAKAN LOGIN ULANG.</p>;

  return (
    <div className="p-8">
      {/* Isi Tampilan Biodata Kamu di Sini */}
      <h1 className="font-bold text-[#800000]">BIODATA: {user.namaLengkap}</h1>
    </div>
  );
}