"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function CtaSection() {
  return (
    <section
      // Menggunakan tinggi responsif:
      // h-[30vh] di mobile, h-[50vh] di tablet, dan maksimum 546px di desktop besar
      className="relative w-full h-[30vh] sm:h-[40vh] md:h-[50vh] max-h-[546px] mx-auto overflow-hidden"
    >
      {/* Gambar Utama (diblur lembut) */}
      <Image
        src="/assetgambar/imageStore.webp"
        alt="Background Illustration"
        fill
        className="object-cover blur-sm brightness-90"
        priority
      />

      {/* Gambar Kedua (logo di tengah) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/assetgambar/LogoPutih.png"
          alt="Article Logo"
          // Ukuran tetap besar untuk kualitas, tetapi dikontrol oleh CSS
          width={800}
          height={800}
          // Kontrol responsif: Lebar 80% di mobile, max-w-lg di desktop kecil, max-w-xl di desktop besar
          className="w-[80%] max-w-md sm:max-w-lg md:max-w-xl object-contain h-auto opacity-90"
          priority
        />
      </div>
    </section>
  );
}
