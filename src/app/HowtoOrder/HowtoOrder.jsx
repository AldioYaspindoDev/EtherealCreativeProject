import { FaWhatsapp } from "react-icons/fa";
import { AiFillWarning } from "react-icons/ai";

export default function HowtoOrde() {
  return (
    <>
      <div className="max-w-2xl mx-auto my-20">
        <div className="bg-white shadow-xl overflow-hidden border border-gray-100">
          {/* Header Card */}
          <div className="bg-blue-800 px-6 py-5">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              Cara Pesan
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Ikuti langkah mudah berikut untuk melakukan pemesanan
            </p>
          </div>

          {/* Body Card */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border hover:shadow-md transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  1
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Pilih Produk
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Pilih produk yang Anda inginkan dari katalog kami
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border hover:shadow-md transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  2
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Isi Detail Pemesanan
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Lengkapi formulir dengan data yang benar
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border  hover:shadow-md transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  3
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Klik Tombol Pesan
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Tekan tombol{" "}
                    <span className="font-semibold text-indigo-700">
                      "Pesan Sekarang"
                    </span>{" "}
                    di bawah
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border hover:shadow-md transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  4
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                    Lanjut ke WhatsApp
                    <FaWhatsapp className="text-[25px]" />
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Pemesanan otomatis diteruskan ke WhatsApp
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border hover:shadow-md transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  5
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Tunggu Konfirmasi
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Admin kami akan segera merespons pesanan Anda
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Card */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-t border-amber-100">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-400 text-white rounded-full flex items-center justify-center text-lg">
                <AiFillWarning />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Tips Penting
                </p>
                <p className="text-sm text-amber-800">
                  Pastikan nomor WhatsApp Anda aktif agar proses pemesanan lebih
                  cepat dan lancar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
