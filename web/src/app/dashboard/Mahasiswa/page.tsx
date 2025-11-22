"use client";

import { useState } from "react";

export default function MahasiswaDashboard() {
  const [npm, setNpm] = useState("");
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (npm.trim() === "") {
      setError("Masukkan NPM terlebih dahulu.");
      return;
    }
    setError("Mahasiswa tidak ditemukan."); // dummy message
  };

  return (
    <div className="min-h-screen bg-[#f7fbff] py-10 flex justify-center">
      <div className="w-full max-w-6xl space-y-8">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-8 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Mahasiswa</h1>
            <p className="text-blue-100">Akses cepat data akademik mahasiswa.</p>
          </div>

          <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center border border-white/40">
            <span className="text-lg">🎓</span>
          </div>
        </div>

        {/* SEARCH SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Cari Mahasiswa (NPM)</h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={npm}
              onChange={(e) => setNpm(e.target.value)}
              placeholder="Masukkan NPM mahasiswa"
              className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow"
            >
              Cari
            </button>
          </div>

          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>

        {/* RESULT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
            <p className="text-gray-500">SKS Tervalidasi</p>
            <h3 className="text-3xl font-bold text-blue-600">92</h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
            <p className="text-gray-500">IPK</p>
            <h3 className="text-3xl font-bold text-blue-600">3.56</h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
            <p className="text-gray-500">Semester</p>
            <h3 className="text-3xl font-bold text-blue-600">6</h3>
          </div>
        </div>

        {/* HASIL PENCARIAN */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-1">
            Hasil Pencarian
          </h2>
          <p className="text-gray-500 text-sm">
            Hasil akan muncul di sini setelah pencarian dilakukan.
          </p>
        </div>

        {/* TABEL AKADEMIK */}
        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Riwayat Akademik
          </h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="p-3 border">Semester</th>
                <th className="p-3 border">Mata Kuliah</th>
                <th className="p-3 border">SKS</th>
                <th className="p-3 border">Nilai</th>
                <th className="p-3 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border">Ganjil 2023/2024</td>
                <td className="p-3 border">Algoritma & Struktur Data</td>
                <td className="p-3 border">3</td>
                <td className="p-3 border">88</td>
                <td className="p-3 border font-bold text-blue-600">A</td>
              </tr>

              <tr className="bg-gray-50">
                <td className="p-3 border">Ganjil 2023/2024</td>
                <td className="p-3 border">Basis Data</td>
                <td className="p-3 border">3</td>
                <td className="p-3 border">85</td>
                <td className="p-3 border font-bold text-blue-600">A-</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
