// Fungsi untuk membuang semua karakter selain angka
export const filterAngka = (value: string) => {
    return value.replace(/\D/g, ""); // \D berarti "bukan digit"
  };