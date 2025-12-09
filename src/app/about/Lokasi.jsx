"use client";

export default function Lokasi() {
  return (
    <div>
      {/* Lokasi */}
      <section
        className="container mx-auto 
                          px-4 sm:px-6 md:px-10 lg:px-16 
                          py-12 md:py-20 text-center text-black "
      >
        {/* Judul Responsif */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 md:mb-8">
          Lokasi Ethereal Store
        </h2>

        {/* Container Alamat */}
        <div
          className="rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 
                        max-w-4xl mx-auto shadow-xl bg-gray-50 border border-blue-900"
        >
          <p className="text-lg sm:text-xl lg:text-2xl text-blue-900 font-medium leading-relaxed">
            Jl. Bandar Damar No.16, Olo, Padang Barat, Kota Padang, Sumatera
            Barat 25171
          </p>
        </div>
      </section>
    </div>
  );
}
