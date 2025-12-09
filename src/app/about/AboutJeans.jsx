"use client";

import Image from "next/image";

export default function AboutJeans() {
  return (
    <div>
      {/* Jeans */}
      <section
        className="container text-black mx-auto 
                          px-4 sm:px-8 md:px-12 lg:px-20 
                          py-16 md:py-20 
                          grid md:grid-cols-2 
                          gap-10 md:gap-16 lg:gap-24 
                          items-center"
      >
        {/* Kolom Gambar (SEKARANG DI ATAS - Tampil di Atas pada Mobile, Kiri pada Desktop) */}
        {/* Menggunakan div wrapper dan 'fill' untuk adaptasi ukuran gambar */}
        <div className="relative w-full h-64 sm:h-80 md:h-[400px]">
          <Image
            src="/assetgambar/jeans1.webp"
            alt="Ethereal Jeans"
            fill // Menggunakan 'fill' agar gambar mengisi div container
            className="rounded-xl shadow-lg object-cover" // object-cover agar gambar tidak terdistorsi
          />
        </div>

        {/* Kolom Teks (SEKARANG DI BAWAH - Tampil di Bawah pada Mobile, Kanan pada Desktop) */}
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 lg:mb-5">
            ETHEREAL Jeans
          </h2>
          <p className="text-base sm:text-lg text-justify leading-relaxed">
            Koleksi jeans Ethereal dibuat dengan bahan terbaik, desain modern,
            dan kenyamanan maksimal untuk mendukung aktivitas sehari-hari kamu.
          </p>
        </div>
      </section>
    </div>
  );
}
