"use client";

import Image from "next/image";
import { useScrollAnimation, useCountUp } from "@/hooks/useScrollAnimation";

export default function AboutStore() {
  const [imageRef, imageVisible] = useScrollAnimation({ threshold: 0.2 });
  const [textRef, textVisible] = useScrollAnimation({ threshold: 0.2 });
  const [statsRef, statsVisible] = useScrollAnimation({ threshold: 0.3 });

  // Number counters for stats
  const count1 = useCountUp(100, 2000, statsVisible);
  const count2 = useCountUp(500, 2000, statsVisible);

  return (
    <div id="about-store" className="bg-white">
      {/* Tentang Perusahaan - Main Section */}
      <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-20 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Image Column - dengan scroll animation */}
          <div
            ref={imageRef}
            className={`relative w-full h-72 sm:h-80 md:h-96 lg:h-[450px] group scroll-animate ${
              imageVisible ? "visible animate-slide-in-left" : ""
            }`}
          >
            <div className="absolute inset-0 bg-blue-900 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300" />
            <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/assetgambar/imagestore2.webp"
                alt="Ethereal Store Interior"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Text Column - dengan scroll animation */}
          <div
            ref={textRef}
            className={`space-y-4 sm:space-y-6 scroll-animate ${
              textVisible ? "visible animate-slide-in-right" : ""
            }`}
          >
            {/* Small tag */}
            <div className="inline-block">
              <span className="bg-blue-100 text-blue-900 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold">
                Tentang Kami
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-black leading-tight">
              Welcome to{" "}
              <span className="text-blue-900">ETHEREAL</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Ethereal merupakan bisnis clothing yang menjual baju dan
              menyediakan jasa custom gratis. Konsumen dapat mendesain sesuai
              keinginan sendiri menggunakan{" "}
              <span className="font-semibold text-blue-900">
                sablon premium (DTF - Direct Transfer Film)
              </span>
              .
            </p>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Selain kaos, tersedia juga Polo, Hoodie, dan berbagai produk
              fashion lainnya dengan kualitas terbaik.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-900 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm sm:text-base text-gray-700 font-medium">
                  Custom Gratis
                </span>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-900 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm sm:text-base text-gray-700 font-medium">
                  Sablon DTF Premium
                </span>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-900 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm sm:text-base text-gray-700 font-medium">
                  Kualitas Terjamin
                </span>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-900 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm sm:text-base text-gray-700 font-medium">
                  Harga Terjangkau
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - dengan number counter animation */}
      <section
        ref={statsRef}
        className="bg-gradient-to-r from-blue-900 to-blue-800 py-12 sm:py-16"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className={`text-center scroll-animate ${statsVisible ? "visible animate-fade-in animation-delay-100" : ""}`}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                {count1}+
              </div>
              <div className="text-sm sm:text-base text-blue-100">
                Produk Custom
              </div>
            </div>
            <div className={`text-center scroll-animate ${statsVisible ? "visible animate-fade-in animation-delay-200" : ""}`}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                {count2}+
              </div>
              <div className="text-sm sm:text-base text-blue-100">
                Pelanggan Puas
              </div>
            </div>
            <div className={`text-center scroll-animate ${statsVisible ? "visible animate-fade-in animation-delay-300" : ""}`}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                DTF
              </div>
              <div className="text-sm sm:text-base text-blue-100">
                Sablon Premium
              </div>
            </div>
            <div className={`text-center scroll-animate ${statsVisible ? "visible animate-fade-in animation-delay-400" : ""}`}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                24/7
              </div>
              <div className="text-sm sm:text-base text-blue-100">
                Layanan Online
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
