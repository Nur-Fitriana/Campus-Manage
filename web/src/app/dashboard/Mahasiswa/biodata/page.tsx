import Link from "next/link";

// Contoh di menu navigasi:
<Link href="/dashboard/mahasiswa/biodata" className="hover:text-[#800000] cursor-pointer">
  Biodata
</Link>

export default function BiodataPage() {
    return (
      <div className="p-6 bg-white shadow-sm mt-5 border border-gray-200">
        <h2 className="text-[#800000] font-bold uppercase text-sm border-b pb-2 mb-4">Profil Lengkap Mahasiswa</h2>
        {/* Isi dengan tabel data diri */}
      </div>
    );
  }