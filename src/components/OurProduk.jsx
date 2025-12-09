"use client";

import Image from "next/image";

export default function OurProductSection() {
  return (
    // Menggunakan padding vertikal yang adaptif
    <section className="w-full bg-white py-12 md:py-20">
      {/* Judul: Ukuran font responsif dan margin bawah adaptif */}
      <div className="text-center mb-8 md:mb-16 px-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium font-[Poppins] text-black">
          Our Product
        </h2>
      </div>

      {/* Grid Produk: Tetap 3 kolom di SEMUA ukuran (grid-cols-3) */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-2 sm:gap-4 lg:gap-8 px-2 sm:px-4">
        {/* Produk 1 */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/assetgambar/Produk1.webp"
            alt="Jeans"
            width={400}
            height={800}
            loading="lazy"
            className="object-cover rounded-lg shadow-md hover:scale-[1.03] transition-transform duration-300 border border-blue-900"
          />
          {/* Penyesuaian font agar judul tetap muat dalam 3 kolom di HP */}
          <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-normal text-black font-[Poppins] mt-2 sm:mt-4 truncate w-full px-1">
            Jeans
          </h3>
          {/* Penyesuaian font deskripsi agar lebih kecil di HP */}
          <p className="text-[10px] sm:text-xs md:text-sm text-black font-[Poppins] mt-1 md:mt-2 px-1">
            Jeans berkualitas tinggi dengan harga tetap terjangkau. Nyaman
            dipakai, stylish untuk setiap kesempatan.
          </p>
        </div>

        {/* Produk 2 */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/assetgambar/Produk2.webp"
            alt="Pakaian"
            width={400}
            height={800}
            loading="lazy"
            // Perubahan: Hapus h-[500px]
            className="object-cover rounded-lg shadow-md hover:scale-[1.03] transition-transform duration-300 border border-blue-900"
          />
          {/* Penyesuaian font agar judul tetap muat dalam 3 kolom di HP */}
          <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-normal text-black font-[Poppins] mt-2 sm:mt-4 truncate w-full px-1">
            Pakaian
          </h3>
          {/* Penyesuaian font deskripsi agar lebih kecil di HP */}
          <p className="text-[10px] sm:text-xs md:text-sm text-black font-[Poppins] mt-1 md:mt-2 px-1">
            Banyak pilihan pakaian untuk memenuhi kebutuhan sekaligus
            mengekspresikan gaya Anda.
          </p>
        </div>

        {/* Produk 3 */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/assetgambar/Produk3.webp"
            alt="Sablon"
            width={400}
            height={800}
            loading="lazy"
            // Perubahan: Hapus h-[500px]
            className="object-cover rounded-lg shadow-md hover:scale-[1.03] transition-transform duration-300 border border-blue-900"
          />
          {/* Penyesuaian font agar judul tetap muat dalam 3 kolom di HP */}
          <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-normal text-black font-[Poppins] mt-2 sm:mt-4 truncate w-full px-1">
            Sablon
          </h3>
          {/* Penyesuaian font deskripsi agar lebih kecil di HP */}
          <p className="text-[10px] sm:text-xs md:text-sm text-black font-[Poppins] mt-1 md:mt-2 px-1">
            Wujudkan desain sablon impian Anda dengan custom gratis.
          </p>
        </div>
      </div>
    </section>
  );
}
