export async function getMahasiswa() {
    const res = await fetch("http://localhost:3004/api/mahasiswa", {
      cache: "no-store",
    });
    return res.json();
  }
  
  export async function getMahasiswaById(npm: string) {
    const res = await fetch(`http://localhost:3004/api/mahasiswa/${npm}`, {
      cache: "no-store",
    });
    return res.json();
  }
  