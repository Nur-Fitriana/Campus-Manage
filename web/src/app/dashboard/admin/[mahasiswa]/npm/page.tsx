"use client";
import { useEffect, useState } from "react";

interface Mahasiswa {
  npm: string;
  nama: string;
  programStudi: string;
  angkatan: string;
  alamat?: string;
  status: string;
}

export default function EditMahasiswa({
  params,
}: {
  params: { npm: string };
}) {
  const { npm } = params;
  const [form, setForm] = useState<Mahasiswa | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3004/mahasiswa/${npm}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [npm]);

  if (!form) return <p>Loading...</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`http://localhost:3004/mahasiswa/${npm}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    window.location.href = "/mahasiswa";
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Mahasiswa</h1>

      <input name="nama" value={form.nama} onChange={handleChange} />
      <input name="programStudi" value={form.programStudi} onChange={handleChange} />
      <input name="angkatan" value={form.angkatan} onChange={handleChange} />
      <input name="alamat" value={form.alamat} onChange={handleChange} />

      <button type="submit">Update</button>
    </form>
  );
}
