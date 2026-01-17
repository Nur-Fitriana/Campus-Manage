"use client";

import { useState, useEffect } from "react";

// Interface disesuaikan dengan schema.prisma kamu
interface UserData {
  namaLengkap: string;
  npm: string;
  prodi: string;
  fakultas: string;
  email: string;
  noTelepon: string;
  alamat: string;
  angkatan: number;
  ipk: number;
  status: string;
}

export default function BiodataPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
        const token = localStorage.getItem("user_token"); // Pastikan nama key ini sama dengan saat login
        
        if (!token) {
          console.error("Token tidak ditemukan, silakan login ulang");
          setLoading(false);
          return;
        }
      
        try {
          const res = await fetch("/api/mahasiswa/profile", {
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          
          if (!res.ok) {
            const errorData = await res.json();
            console.error("API Error:", errorData.error);
            throw new Error(errorData.error);
          }
          
          const data = await res.json();
          setUser({
            namaLengkap: data.namaLengkap,
            npm: data.npm,
            prodi: data.programStudi?.nama || "-",
            fakultas: data.programStudi?.fakultas || "-",
            email: data.email,
            noTelepon: data.noTelepon,
            alamat: data.alamat,
            angkatan: data.angkatan,
            ipk: data.ipk,
            status: data.status,
          });
        } catch (err) {
          console.error("Gagal memuat data:", err);
        } finally {
          setLoading(false);
        }
      };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold text-xs uppercase">Memproses Data...</div>;
  
  if (!user) return (
    <div className="p-10 text-center">
      <p className="text-red-600 font-bold text-xs">DATA TIDAK DITEMUKAN / SESI HABIS</p>
      <button onClick={() => window.location.href='/login'} className="mt-4 text-xs underline">Login Kembali</button>
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm rounded-sm">
        <div className="bg-[#f8f9fa] px-6 py-3 border-b border-gray-200">
          <h2 className="text-[#800000] font-bold text-[12px] uppercase tracking-wider">
            Biodata Mahasiswa - {user.npm}
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Nama Lengkap" value={user.namaLengkap} />
          <InfoItem label="Program Studi" value={user.prodi} />
          <InfoItem label="Fakultas" value={user.fakultas} />
          <InfoItem label="Angkatan" value={user.angkatan.toString()} />
          <InfoItem label="IPK Terakhir" value={user.ipk.toString()} />
          <InfoItem label="Status Akreditasi" value={user.status} />
          <InfoItem label="No. Telepon" value={user.noTelepon} />
          <InfoItem label="Alamat" value={user.alamat} />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-gray-50 pb-2">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{label}</p>
      <p className="text-[12px] font-semibold text-gray-700">{value}</p>
    </div>
  );
}