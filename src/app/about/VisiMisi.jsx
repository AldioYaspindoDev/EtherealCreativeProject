"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function VisiMisi() {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });
  const [visiRef, visiVisible] = useScrollAnimation({ threshold: 0.2 });
  const [misiRef, misiVisible] = useScrollAnimation({ threshold: 0.2 });
  const [valuesRef, valuesVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Visi & Misi - Redesigned */}
      <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-20 md:py-24">
        {/* Header - dengan scroll animation */}
        <div
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 scroll-animate ${
            headerVisible ? "visible animate-fade-in" : ""
          }`}
        >
          <span className="bg-blue-100 text-blue-900 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold">
            Visi & Misi Kami
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mt-4 mb-4">
            Komitmen <span className="text-blue-900">ETHEREAL</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Kami berkomitmen untuk memberikan yang terbaik bagi setiap pelanggan
          </p>
        </div>

        {/* Cards Grid - dengan scroll animations */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {/* Visi Card */}
          <div
            ref={visiRef}
            className={`bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 scroll-animate ${
              visiVisible ? "visible animate-slide-in-left" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="bg-blue-900 p-3 rounded-xl">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-black">
                Visi
              </h3>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              Menjadi brand clothing lokal yang dikenal akan{" "}
              <span className="font-semibold text-blue-900">
                kualitas, inovasi
              </span>
              , dan pelayanan pelanggan yang unggul di seluruh Indonesia.
            </p>
          </div>

          {/* Misi Card */}
          <div
            ref={misiRef}
            className={`bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 scroll-animate ${
              misiVisible ? "visible animate-slide-in-right" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="bg-blue-900 p-3 rounded-xl">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-black">
                Misi
              </h3>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              Menghadirkan produk berkualitas tinggi dengan{" "}
              <span className="font-semibold text-blue-900">
                harga terjangkau
              </span>{" "}
              serta layanan custom yang memuaskan untuk setiap pelanggan.
            </p>
          </div>
        </div>

        {/* Additional Values - dengan staggered animation */}
        <div ref={valuesRef} className="mt-12 sm:mt-16">
          <h3 className={`text-2xl sm:text-3xl font-bold text-center text-black mb-8 scroll-animate ${valuesVisible ? "visible animate-fade-in" : ""}`}>
            Nilai-Nilai Kami
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {[
              { icon: "⭐", label: "Kualitas" },
              { icon: "💡", label: "Inovasi" },
              { icon: "🤝", label: "Kepercayaan" },
              { icon: "❤️", label: "Kepuasan" },
            ].map((value, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-4 sm:p-6 text-center shadow-md hover:shadow-lg transition-all scroll-animate ${
                  valuesVisible ? `visible animate-scale-in animation-delay-${(index + 1) * 100}` : ""
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2">{value.icon}</div>
                <p className="text-sm sm:text-base font-semibold text-gray-800">
                  {value.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
