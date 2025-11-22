export type Mahasiswa = {
  id: number;
  npm: string;
  nama: string;
  programStudi: string;
  angkatan: string;
  alamat?: string;
  status: "AKTIF" | "CUTI" | "TIDAK_AKTIF" | "LULUS";
  createdAt: string;
  updatedAt: string;
};

export type MahasiswaForm = Pick<
  Mahasiswa,
  "npm" | "nama" | "programStudi" | "angkatan" | "alamat"
>;
