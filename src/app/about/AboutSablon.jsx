"use client";

import Image from "next/image";

export default function AboutSablon() {
  return (
    <div>
      {/* Jasa Sablon */}
      <section
        className="container text-black mx-auto 
                          px-4 sm:px-8 md:px-12 lg:px-20 
                          py-16 md:py-20 
                          grid md:grid-cols-2 
                          gap-10 md:gap-16 lg:gap-24 
                          items-center"
      >
        {/* Kolom Gambar (Tampil di Atas pada Mobile, Sekarang di KANAN pada Desktop) */}
        {/* Kita tambahkan md:order-last agar Gambar pindah ke Kanan di desktop. */}
        <div className="relative w-full h-64 sm:h-80 md:h-[400px] md:order-last">
          <Image
            src="/assetgambar/sablon1.webp"
            alt="Sablon Ethereal"
            fill // Menggunakan 'fill' agar gambar mengisi div container
            className="rounded-xl shadow-lg object-cover" // object-cover agar gambar tidak terdistorsi
          />
        </div>

        {/* Kolom Teks (Tampil di Bawah pada Mobile, Sekarang di KIRI pada Desktop) */}
        {/* Teks akan otomatis menjadi kolom pertama di desktop karena Gambar memiliki md:order-last */}
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 lg:mb-5">
            ETHEREAL Sablon
          </h2>
          <p className="text-base sm:text-lg text-justify leading-relaxed">
            Kami menggunakan teknologi DTF (Direct Transfer Film) dengan hasil
            sablon yang tajam, awet, dan berkualitas tinggi. Desain apapun bisa
            kami wujudkan!
          </p>
        </div>
      </section>
    </div>
  );
}
