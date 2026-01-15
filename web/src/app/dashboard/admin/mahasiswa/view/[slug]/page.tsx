"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, MapPin, GraduationCap } from "lucide-react";
import styles from "@/app/dashboard/admin/mahasiswa/mahasiswa.module.css";

// Update interface agar mencakup objek programStudi
interface Mahasiswa {
  npm: string;
  namaLengkap: string;
  programStudiId: string;
  programStudi?: { nama: string }; // Tambahkan ini untuk nama prodi
  angkatan: number;
  status: string;
  alamat?: string | null;
  email?: string;
  jenisKelamin: string;
}

export default function ViewMahasiswa() {
  const { npm } = useParams();
  const router = useRouter();
  const [mhs, setMhs] = useState<Mahasiswa | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // PENTING: Gunakan port 3004 (Backend)
        const res = await fetch(`http://localhost:3004/api/dashboard/admin/mahasiswa/${npm}`);
        const json = await res.json();
        if (json.mahasiswa) {
          setMhs(json.mahasiswa);
        }
      } catch (err) {
        console.error("Gagal mengambil data", err);
      }
    };
    
    if (npm) fetchData();
  }, [npm]);

  if (!mhs) return <p className="p-6 text-center">Memuat data mahasiswa...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.btnSecondary} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={18} /> Kembali
        </button>
        <h1 className={styles.title}>Detail Mahasiswa</h1>
      </div>

      <div className={styles.card} style={{ padding: "2rem" }}>
        <div style={{ display: "flex", gap: "2rem", alignItems: "start" }}>
          {/* Avatar Placeholder */}
          <div style={{ background: "#f3f4f6", padding: "2rem", borderRadius: "1rem" }}>
            <User size={64} className="text-gray-400" />
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              {mhs.namaLengkap}
            </h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <p className="text-sm text-gray-500">NPM</p>
                <p className="font-medium">{mhs.npm}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program Studi</p>
                {/* Menampilkan Nama Prodi, bukan cuma ID */}
                <p className="font-medium">{mhs.programStudi?.nama || mhs.programStudiId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Angkatan</p>
                <p className="font-medium">{mhs.angkatan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span style={{ 
                  padding: "2px 8px", 
                  borderRadius: "12px", 
                  fontSize: "12px",
                  background: mhs.status === "AKTIF" ? "#dcfce7" : "#fee2e2",
                  color: mhs.status === "AKTIF" ? "#166534" : "#991b1b"
                }}>
                  {mhs.status}
                </span>
              </div>
            </div>

            <hr style={{ margin: "1.5rem 0", borderColor: "#f3f4f6" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Mail size={16} className="text-blue-500" />
                <span>{mhs.email}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <MapPin size={16} className="text-blue-500" />
                <span>{mhs.alamat || "Alamat belum diisi"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}