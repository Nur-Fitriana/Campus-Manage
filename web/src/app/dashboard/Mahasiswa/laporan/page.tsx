"use client";

import React from 'react';

export default function LaporanPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Laporan Mahasiswa</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">
          Halaman ini digunakan untuk melihat laporan akademik.
        </p>
        <div className="mt-4 p-4 border-l-4 border-blue-500 bg-blue-50">
          Belum ada laporan yang tersedia saat ini.
        </div>
      </div>
    </div>
  );
}