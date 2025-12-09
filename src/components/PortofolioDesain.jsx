"use client";

import Image from "next/image";
import Link from "next/link";

export default function PortfolioDesain() {
  return (
    // Padding vertikal yang adaptif
    <section className="w-full bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-20 px-4 sm:px-8">
        {/* 🔹 Bagian Kiri (Teks & Deskripsi) */}
        {/* Mengubah space-y kaku menjadi nilai responsif */}
        <div className="flex-1 space-y-6 md:space-y-10 lg:space-y-16 order-2 md:order-1">
          {/* Judul: Ukuran font responsif (kecil di mobile, besar di desktop) */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium font-['Poppins'] text-black">
            Print Your Desain
          </h2>

          {/* Deskripsi: Ukuran font responsif (kecil di mobile) */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black font-normal font-['Poppins'] text-justify leading-relaxed">
            Sablon Direct to Film (DTF) adalah teknik cetak sablon modern yang
            mencetak desain langsung ke media film, lalu dipindahkan ke kain
            menggunakan panas. Keunggulannya adalah mampu menghasilkan gambar
            dengan detail tinggi, warna yang tajam, serta daya tahan lebih kuat
            dibanding sablon konvensional.
          </p>

          {/* Link: Ukuran font disesuaikan */}
          <Link
            href="/portofolio"
            className="inline-block text-sm sm:text-base md:text-lg text-zinc-600 font-medium font-['Poppins'] underline hover:text-black transition"
          >
            Lihat Hasil Sablon Lainnya
          </Link>
        </div>

        {/* 🔹 Bagian Kanan (Gambar) */}
        {/* Menggunakan order-1 untuk menempatkan gambar di atas teks di mobile */}
        <div className="flex-1 relative flex justify-center w-full md:w-auto order-1 md:order-2">
          {/* Background abu-abu: Menggunakan persentase lebar yang lebih stabil dan tinggi yang fleksibel */}
          <div className="absolute w-[90%] h-[95%] bg-zinc-300 rounded-xl shadow-lg -rotate-3 transform origin-center"></div>

          {/* Gambar utama: Menggunakan aspect ratio, bukan tinggi tetap 500px */}
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-[3/4] z-10">
            <Image
              src="/assetgambar/Sablonimage.webp"
              alt="Desain DTF"
              fill
              className="object-cover rounded-xl shadow-xl transform rotate-3"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
