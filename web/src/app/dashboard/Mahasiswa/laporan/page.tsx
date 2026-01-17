"use client";

import React, { useState } from 'react';
import { FileText, Printer, Download, Search, Filter } from "lucide-react";

// Contoh Data dummy
const DATA_LAPORAN = [
  { id: 1, npm: "21312001", nama: "Alex Junaidi", prodi: "Informatika", ipk: 3.85, status: "Aktif" },
  { id: 2, npm: "21312005", nama: "Siti Aminah", prodi: "Sistem Informasi", ipk: 3.92, status: "Aktif" },
  { id: 3, npm: "21312010", nama: "Budi Santoso", prodi: "Teknik Komputer", ipk: 3.45, status: "Lulus" },
];

export default function LaporanPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-[900] italic uppercase text-[#800000] tracking-tighter">
            Laporan Akademik
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Manajemen Data & Statistik Mahasiswa
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border-2 border-gray-100 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-50 transition-all shadow-sm">
            <Printer size={16} className="text-[#800000]" /> Cetak PDF
          </button>
          <button className="flex items-center gap-2 bg-[#800000] px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-wider hover:bg-black transition-all shadow-lg shadow-red-900/20">
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="max-w-7xl mx-auto bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Cari Nama atau NPM..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#800000]/10 focus:bg-white outline-none font-bold text-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-gray-50 px-6 py-2 rounded-xl text-gray-500 font-bold text-sm hover:bg-gray-100 transition-all">
          <Filter size={18} /> Filter Jurusan
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-xl border border-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">NPM</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Mahasiswa</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Program Studi</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">IPK</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DATA_LAPORAN.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="p-5 font-black text-xs text-[#800000]">{item.npm}</td>
                  <td className="p-5 font-bold text-sm text-gray-800">{item.nama}</td>
                  <td className="p-5">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                      {item.prodi}
                    </span>
                  </td>
                  <td className="p-5 text-center font-black text-sm">{item.ipk}</td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      item.status === 'Aktif' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE (Jika data kosong) */}
        {DATA_LAPORAN.length === 0 && (
          <div className="p-20 text-center">
            <div className="inline-flex p-6 bg-gray-50 rounded-full mb-4">
              <FileText size={40} className="text-gray-300" />
            </div>
            <h3 className="text-gray-800 font-black uppercase text-sm tracking-widest">Belum Ada Data</h3>
            <p className="text-gray-400 text-xs mt-1 font-bold">Laporan akademik akan muncul setelah data diproses.</p>
          </div>
        )}
      </div>
    </div>
  );
}