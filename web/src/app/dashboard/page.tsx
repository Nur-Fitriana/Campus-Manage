"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, FileText, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">

      {/* TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-blue-700">Dashboard Admin</h1>
        <p className="text-gray-600">Selamat Datang di Sistem Akademik.</p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card className="bg-blue-50 border-0 shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-700">Total Mahasiswa</CardTitle>
            <Users className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">1,248</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-0 shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-700">Program Studi</CardTitle>
            <GraduationCap className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">12</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-0 shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-700">Dokumen</CardTitle>
            <FileText className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">89</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-0 shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-700">Status Aktif</CardTitle>
            <CheckCircle className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">94%</p>
          </CardContent>
        </Card>

      </div>

      {/* TABLE PREVIEW AREA */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Aktivitas Terbaru</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Kegiatan</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b hover:bg-blue-50">
                <td className="p-3">22 Jan 2025</td>
                <td className="p-3">Penambahan Data Mahasiswa</td>
                <td className="p-3 text-green-600 font-medium">Sukses</td>
              </tr>

              <tr className="border-b hover:bg-blue-50">
                <td className="p-3">22 Jan 2025</td>
                <td className="p-3">Update Program Studi</td>
                <td className="p-3 text-yellow-600 font-medium">Pending</td>
              </tr>

              <tr className="hover:bg-blue-50">
                <td className="p-3">21 Jan 2025</td>
                <td className="p-3">Sinkronisasi Database</td>
                <td className="p-3 text-green-600 font-medium">Sukses</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
