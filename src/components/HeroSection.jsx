"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    // Menggunakan tinggi yang responsif:
    // Di mobile, 50vh (setengah layar).
    // Di tablet ke atas (md:), 90vh (hampir layar penuh).
    <section className="relative w-full h-[50vh] md:h-[90vh] overflow-hidden">
      {/* 🔹 Background Image */}
      <Image
        src="/assetgambar/HeroImage.webp"
        alt="Hero Background"
        fill
        priority
        className="object-cover"
      />

      {/* 🔹 Overlay Gelap + Blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* 🔹 Konten Utama (Text/Image) */}
      {/* Menambahkan padding horizontal yang responsif: px-4 (kecil) hingga px-8 (besar) */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-8">
        {/* Gambar Logo Putih */}
        {/* Menggunakan max-w-sm di mobile, max-w-xl di tablet, dan max-w-6xl di PC */}
        <Image
          src="/assetgambar/LogoPutih.png"
          alt="Hero Banner"
          width={1000} // Tetap gunakan nilai besar untuk kualitas gambar
          height={300} // Tetap gunakan nilai besar untuk kualitas gambar
          className="w-full max-w-sm md:max-w-xl lg:max-w-6xl h-auto mb-4 md:mb-8"
        />

        {/* Teks Slogan/Hashtag */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mt-4 md:mt-8 text-white text-base sm:text-lg md:text-2xl lg:text-4xl font-normal font-[Poppins]">
          <span className="mb-2 md:mb-0">#DesignYourOwnStyle</span>
          <span>#WearBetterLookBetter</span>
        </div>
      </div>
    </section>
  );
}
