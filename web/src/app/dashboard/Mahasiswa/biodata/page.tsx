"use client";

import React from 'react';

export default function LaporanPage() {
  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm rounded-sm">
        {/* Header Header yang sama dengan Biodata */}
        <div className="bg-[#f8f9fa] px-6 py-3 border-b border-gray-200">
          <h2 className="text-[#800000] font-bold text-[12px] uppercase tracking-wider">
            Laporan Hasil Studi (KHS)
          </h2>
        </div>

        {/* Konten Laporan */}
        <div className="p-10 text-center">
          <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-semibold text-[13px]">Belum ada laporan akademik yang diterbitkan.</p>
          <p className="text-gray-400 text-[11px] mt-1">Silakan hubungi bagian akademik jika terdapat kekeliruan data.</p>
        </div>
      </div>
    </div>
  );
}