"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function OurProductSection() {
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.2 });
  const [product1Ref, product1Visible] = useScrollAnimation({ threshold: 0.2 });
  const [product2Ref, product2Visible] = useScrollAnimation({ threshold: 0.2 });
  const [product3Ref, product3Visible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="w-full bg-white py-12 md:py-20">
      {/* Judul dengan scroll animation */}
      <div
        ref={titleRef}
        className={`text-center mb-8 md:mb-16 px-4 scroll-animate ${
          titleVisible ? "visible animate-fade-in" : ""
        }`}
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium font-[Poppins] text-black">
          Our Product
        </h2>
      </div>

      {/* Grid Produk dengan staggered animations */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-2 sm:gap-4 lg:gap-8 px-2 sm:px-4">
        {/* Produk 1 */}
        <div
          ref={product1Ref}
          className={`flex flex-col items-center text-center scroll-animate ${
            product1Visible ? "visible animate-slide-up animation-delay-100" : ""
          }`}
        >
          <Image
            src="/assetgambar/Produk1.webp"
            alt="Jeans"
            width={400}
            height={800}
            loading="lazy"
            className="object-cover rounded-lg shadow-md hover:scale-[1.03] transition-transform duration-300 border border-blue-900"
          />
          <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-normal text-black font-[Poppins] mt-2 sm:mt-4 truncate w-full px-1">
            Jeans
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-black font-[Poppins] mt-1 md:mt-2 px-1">
            Jeans berkualitas tinggi dengan harga tetap terjangkau. Nyaman
            dipakai, stylish untuk setiap kesempatan.
          </p>
        </div>

        {/* Produk 2 */}
        <div
          ref={product2Ref}
          className={`flex flex-col items-center text-center scroll-animate ${
            product2Visible ? "visible animate-slide-up animation-delay-200" : ""
          }`}
        >
          <Image
            src="/assetgambar/Produk2.webp"
            alt="Pakaian"
            width={400}
            height={800}
            loading="lazy"
            className="object-cover rounded-lg shadow-md hover:scale-[1.03] transition-transform duration-300 border border-blue-900"
          />
          <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-normal text-black font-[Poppins] mt-2 sm:mt-4 truncate w-full px-1">
            Pakaian
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-black font-[Poppins] mt-1 md:mt-2 px-1">
            Banyak pilihan pakaian untuk memenuhi kebutuhan sekaligus
            mengekspresikan gaya Anda.
          </p>
        </div>

        {/* Produk 3 */}
        <div
          ref={product3Ref}
          className={`flex flex-col items-center text-center scroll-animate ${
           product3Visible ? "visible animate-slide-up animation-delay-300" : ""
          }`}
        >
          <Image
            src="/assetgambar/Produk3.webp"
            alt="Sablon"
            width={400}
            height={800}
            loading="lazy"
            className="object-cover rounded-lg shadow-md hover:scale-[1.03] transition-transform duration-300 border border-blue-900"
          />
          <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-normal text-black font-[Poppins] mt-2 sm:mt-4 truncate w-full px-1">
            Sablon
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-black font-[Poppins] mt-1 md:mt-2 px-1">
            Wujudkan desain sablon impian Anda dengan custom gratis.
          </p>
        </div>
      </div>
    </section>
  );
}
