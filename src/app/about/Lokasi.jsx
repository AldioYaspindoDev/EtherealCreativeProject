"use client";

export default function Lokasi() {
  const address = "Jl. Bandar Damar No.16, Olo, Padang Barat, Kota Padang, Sumatera Barat 25171";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="bg-white">
      {/* Lokasi */}
      <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-20 md:py-24">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="bg-blue-100 text-blue-900 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold">
            Lokasi
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mt-4">
            Kunjungi Toko Kami
          </h2>
        </div>

        {/* Location Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            {/* Gradient Border Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl opacity-75 group-hover:opacity-100 blur transition duration-300" />
            
            {/* Main Card */}
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-2xl">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-blue-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Address */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 text-center mb-4">
                Ethereal Kreatif Store
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 text-center leading-relaxed mb-6 sm:mb-8">
                {address}
              </p>

              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-xl p-3 sm:p-4">
                  <svg
                    className="w-5 h-5 text-blue-900 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    +62 895-4150-19150
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-xl p-3 sm:p-4">
                  <svg
                    className="w-5 h-5 text-blue-900 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    Senin - Minggu: 09:00 - 21:00
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-blue-800 transition-all font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <span>Buka di Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
