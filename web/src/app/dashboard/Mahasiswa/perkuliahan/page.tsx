"use client";

import React from 'react';
import { Calendar, Clock, BookOpen, MapPin, User, Search } from "lucide-react";

const JADWAL_HARI_INI = [
  {
    id: 1,
    matkul: "Pemrograman Web II",
    kode: "IF-301",
    dosen: "Dr. Ahmad Subarjo",
    jam: "08:00 - 10:30",
    ruangan: "Lab Komputer 3",
    status: "Berlangsung"
  },
  {
    id: 2,
    matkul: "Struktur Data",
    kode: "IF-202",
    dosen: "Siti Halimah, M.T.",
    jam: "11:00 - 13:30",
    ruangan: "Ruang Teori 4",
    status: "Mendatang"
  }
];

export default function PerkuliahanPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-[900] italic uppercase text-[#800000] tracking-tighter">
            Manajemen Perkuliahan
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
            Tahun Akademik 2025/2026 - Semester Ganjil
          </p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          <button className="px-6 py-2 bg-[#800000] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
            Jadwal Kuliah
          </button>
          <button className="px-6 py-2 text-gray-400 hover:text-[#800000] rounded-xl text-xs font-black uppercase tracking-widest transition-all">
            Presensi
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Daftar Perkuliahan Hari Ini */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="flex items-center gap-2 font-black uppercase text-sm text-gray-800 tracking-widest">
              <Calendar size={18} className="text-[#800000]" /> Jadwal Hari Ini
            </h2>
          </div>

          <div className="space-y-4">
            {JADWAL_HARI_INI.map((jadwal) => (
              <div key={jadwal.id} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-white hover:border-red-100 transition-all group relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${jadwal.status === 'Berlangsung' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-[#800000] uppercase tracking-widest">{jadwal.kode}</span>
                    <h3 className="text-xl font-black text-gray-800 group-hover:text-[#800000] transition-colors">{jadwal.matkul}</h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center gap-1 text-gray-500 text-xs font-bold">
                        <User size={14} /> {jadwal.dosen}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-xs font-bold">
                        <MapPin size={14} /> {jadwal.ruangan}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-[#800000] font-black text-sm">
                        <Clock size={16} /> {jadwal.jam}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${jadwal.status === 'Berlangsung' ? 'text-green-600' : 'text-gray-400'}`}>
                        • {jadwal.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Statistik & Info */}
        <div className="space-y-6">
           <div className="bg-[#800000] p-8 rounded-[2.5rem] text-white shadow-2xl shadow-red-900/30">
              <BookOpen size={32} className="mb-4 opacity-50" />
              <h3 className="text-2xl font-black leading-tight mb-2">Total Mata Kuliah Semester Ini</h3>
              <div className="text-5xl font-black italic">08</div>
              <div className="h-1 w-12 bg-white/30 my-4 rounded-full"></div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest leading-relaxed">
                Pastikan Anda telah mengisi KRS sebelum perkuliahan dimulai.
              </p>
           </div>

           <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <h4 className="font-black uppercase text-xs text-gray-400 tracking-widest mb-4">Pengumuman</h4>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-2xl border-l-4 border-orange-500">
                  <p className="text-xs font-bold text-orange-800 leading-relaxed">
                    Ujian Tengah Semester (UTS) akan dilaksanakan serentak pada tanggal 20 Oktober 2025.
                  </p>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}