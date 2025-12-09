"use client";

import Image from "next/image";

export default function AboutClothes() {
  return (
    <div>
      {/* Produk */}
      <section
        className="container text-black mx-auto 
                          px-4 sm:px-8 md:px-12 lg:px-20 
                          py-16 md:py-20 
                          grid md:grid-cols-2 
                          gap-10 md:gap-16 lg:gap-24 
                          items-center"
      >
        {/* Kolom Gambar (Tampil di Kiri pada Mobile) */}
        {/* Tambahkan order-last untuk memindahkannya ke kanan di desktop */}
        <div className="relative w-full h-64 sm:h-80 md:h-[400px] md:order-last">
          <Image
            src="/assetgambar/imagestore5.webp"
            alt="Produk Ethereal"
            fill // Menggunakan 'fill' agar gambar mengisi div container
            className="rounded-xl shadow-lg object-cover"
          />
        </div>

        {/* Kolom Teks (Tampil di Bawah Gambar pada Mobile) */}
        {/* Teks akan otomatis berada di kiri pada desktop */}
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 lg:mb-5">
            ETHEREAL Clothes
          </h2>
          <p className="text-base sm:text-lg text-justify leading-relaxed">
            Kami menawarkan beragam produk fashion berkualitas tinggi dengan
            bahan premium dan desain eksklusif. Nikmati pengalaman personalisasi
            desain sesuai gaya kamu sendiri.
          </p>
        </div>
      </section>
    </div>
  );
}
