"use client";

import { GraduationCap, BookOpen, ClipboardList, User2 } from "lucide-react";

export default function MahasiswaDashboard() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Mahasiswa</h1>
        <p className="text-gray-600">Informasi akademik mahasiswa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <User2 size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nama Mahasiswa</p>
              <p className="text-lg font-semibold">Budi Santoso</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <ClipboardList size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-semibold">Aktif</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
              <BookOpen size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">SKS Tempuh</p>
              <p className="text-lg font-semibold">84 SKS</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 text-red-600 p-3 rounded-lg">
              <GraduationCap size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">IPK</p>
              <p className="text-lg font-semibold">3.72</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Riwayat Studi</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Semester</th>
              <th className="py-2">Jumlah SKS</th>
              <th className="py-2">IPS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">Semester 1</td>
              <td>20</td>
              <td>3.55</td>
            </tr>
            <tr className="border-b">
              <td className="py-3">Semester 2</td>
              <td>22</td>
              <td>3.70</td>
            </tr>
            <tr>
              <td className="py-3">Semester 3</td>
              <td>21</td>
              <td>3.92</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
