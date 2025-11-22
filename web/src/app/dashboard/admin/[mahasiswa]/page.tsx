"use client";

import { useEffect, useState } from "react";

interface Mahasiswa {
  id: number;
  npm: string;
  nama: string;
  programStudi: string;
  angkatan: number;
  alamat: string | null;
  status: string;
  createdAt: string;
}

export default function AdminMahasiswa() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getMahasiswa = async (): Promise<void> => {
    try {
      const res = await fetch("http://localhost:3001/mahasiswa");
      const json: { success: boolean; mahasiswa: Mahasiswa[] } = await res.json();

      if (json.success) {
        setMahasiswa(json.mahasiswa);
      }
    } catch (error) {
      console.error("Gagal Fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMahasiswa();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Data Mahasiswa</h1>

      {loading ? (
        <p>Loading...</p>
      ) : mahasiswa.length === 0 ? (
        <p>Tidak ada data mahasiswa.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="border p-3">NPM</th>
              <th className="border p-3">Nama</th>
              <th className="border p-3">Prodi</th>
              <th className="border p-3">Angkatan</th>
              <th className="border p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {mahasiswa.map((m) => (
              <tr key={m.id} className="hover:bg-blue-50">
                <td className="border p-3">{m.npm}</td>
                <td className="border p-3">{m.nama}</td>
                <td className="border p-3">{m.programStudi}</td>
                <td className="border p-3">{m.angkatan}</td>
                <td className="border p-3">{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
