import { Mahasiswa } from "./mahasiswa";

export async function fetchMahasiswaAll(): Promise<Mahasiswa[]> {
    const res = await fetch("http://localhost:3004/api/mahasiswa", {
      cache: "no-store",
    });
  
    return res.json();
  }
  