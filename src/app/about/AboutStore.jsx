"use client";

import Image from "next/image";

export default function AboutStore() {
  return (
    <div>
      {/* Tentang Perusahaan */}
      <section
        className="container text-black mx-auto 
                          px-4 sm:px-8 md:px-12 lg:px-20 
                          py-16 md:py-20 
                          grid md:grid-cols-2 
                          gap-10 md:gap-16 lg:gap-24 
                          items-center"
      >
        {/* Kolom Gambar (SEKARANG DI ATAS - Tampil di Kiri pada Desktop dan di Atas pada Mobile) */}
        <div className="relative w-full h-64 sm:h-80 md:h-[400px]">
          <Image
            src="/assetgambar/imagestore2.webp"
            alt="Ethereal Image"
            fill // Menggunakan 'fill' agar gambar mengisi div container
            className="rounded-xl shadow-lg object-cover" // object-cover agar gambar tidak terdistorsi
          />
        </div>

        {/* Kolom Teks (SEKARANG DI BAWAH - Tampil di Kanan pada Desktop dan di Bawah pada Mobile) */}
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 lg:mb-5">
            About ETHEREAL
          </h2>
          <p className="text-base sm:text-lg text-justify leading-relaxed">
            Ethereal merupakan bisnis clothing yang menjual baju dan menyediakan
            jasa custom gratis. Konsumen dapat mendesain sesuai keinginan
            sendiri menggunakan sablon premium (DTF - Direct Transfer Film).
            Selain kaos, tersedia juga Polo, Hoodie, dan lainnya.
          </p>
        </div>
      </section>
    </div>
  );
}
