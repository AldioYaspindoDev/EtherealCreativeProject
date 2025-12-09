"use client";

import Image from "next/image";

export default function HeroSectionAbout() {
  return (
    <div>
      {/* Hero Section */}
      {/* Tinggi (h) responsif tetap dipertahankan agar tidak terlalu panjang di mobile */}
      <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-zinc-300 flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/assetgambar/imagestore2.webp"
          alt="Hero Image"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay dan Logo Container */}
        <div className="relative z-10 bg-black/40 p-6 md:p-8 lg:p-10 rounded-lg max-w-full">
          {/* Logo - Lebih responsif dengan kontrol max-w dan h */}
          {/* Untuk logo, kita tetapkan lebar maksimal yang responsif (max-w) 
              dan tingginya relatif (h-auto) untuk menjaga rasio aspek. */}
          <div className="relative w-full">
            <Image
              src="/assetgambar/LogoPutih.png"
              alt="Ethereal Logo"
              // Set width dan height yang besar (atau nilai dummy)
              // agar Next.js dapat merender Image, tapi kita atur
              // ukuran sebenarnya sepenuhnya melalui className.
              width={1200}
              height={240}
              className="object-contain w-auto h-auto 
                         max-w-[80vw] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[1000px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
