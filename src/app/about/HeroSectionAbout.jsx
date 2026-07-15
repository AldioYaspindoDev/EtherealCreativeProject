"use client";

import Image from "next/image";

export default function HeroSectionAbout() {
  return (
    <div>
      {/* Hero Section - Modern dengan Gradient Overlay */}
      <section className="relative w-full h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/assetgambar/imagestore2.webp"
          alt="Ethereal Creative Store"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />

        {/* Gradient Overlay - Modern Dark to Transparent */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-0" />

        {/* Content Container */}
        <div className="relative z-10 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
          {/* Logo Container dengan subtle animation */}
          <div className="mb-6 sm:mb-8 md:mb-10 animate-fade-in">
            <Image
              src="/assetgambar/LogoPutih.png"
              alt="Ethereal Creative Logo"
              width={1200}
              height={240}
              className="object-contain w-auto h-auto max-w-[85vw] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] drop-shadow-2xl mx-auto"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-3 sm:space-y-4 animate-slide-up">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
              Wujudkan Gaya Kamu dengan Kreativitas Tanpa Batas
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 max-w-3xl mx-auto drop-shadow-md">
              Custom clothing premium dengan sablon DTF berkualitas tinggi
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10 md:mt-12">
            <a
              href="/catalog"
              className="bg-blue-900 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-blue-800 transition-all font-semibold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              Lihat Katalog
            </a>
            <a
              href="#about-store"
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-white/20 transition-all font-semibold text-sm sm:text-base shadow-xl"
            >
              Tentang Kami
            </a>
          </div>
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <svg
            className="w-6 h-6 text-white opacity-75"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Add simple CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
}
