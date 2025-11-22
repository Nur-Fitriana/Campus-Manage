"use client";
import { useState } from "react";

interface FormData {
  npm: string;
  nama: string;
  programStudi: string;
  angkatan: string;
  alamat: string;
}

export default function TambahMahasiswa() {
  const [form, setForm] = useState<FormData>({
    npm: "",
    nama: "",
    programStudi: "",
    angkatan: "",
    alamat: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("http://localhost:3004/mahasiswa", {
      method: "POST",
      body: JSON.stringify(form),
    });

    window.location.href = "/mahasiswa";
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Tambah Mahasiswa</h1>

      <input name="npm" placeholder="NPM" onChange={handleChange} />
      <input name="nama" placeholder="Nama" onChange={handleChange} />
      <input name="programStudi" placeholder="Program Studi" onChange={handleChange} />
      <input name="angkatan" placeholder="Angkatan" onChange={handleChange} />
      <input name="alamat" placeholder="Alamat" onChange={handleChange} />

      <button type="submit">Simpan</button>
    </form>
  );
}
