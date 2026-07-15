import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function CartSummary({
  selectedItemsCount,
  totalSelected,
  orderHandler,
}) {
  return (
    <>
      {/* Desktop Summary - Sticky Right Column */}
      <div className="hidden md:block md:col-span-4">
        <div className="sticky top-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 lg:p-6 shadow-lg">
            <h3 className="text-lg lg:text-xl font-bold text-black mb-4 lg:mb-5">
              Ringkasan Belanja
            </h3>

            <div className="space-y-3 mb-4 lg:mb-5">
              <div className="flex justify-between items-center text-sm lg:text-base">
                <span className="text-gray-600">
                  Subtotal ({selectedItemsCount} produk)
                </span>
                <span className="font-semibold text-black">
                  Rp {totalSelected.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Pengiriman</span>
                <span className="text-gray-500 text-xs">
                  Dihitung di checkout
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 lg:pt-5 mb-5 lg:mb-6">
              <div className="flex justify-between items-center mb-5 lg:mb-6">
                <span className="font-bold text-lg lg:text-xl text-black">
                  Total
                </span>
                <span className="font-bold text-xl lg:text-2xl text-blue-900">
                  Rp {totalSelected.toLocaleString("id-ID")}
                </span>
              </div>

              <button
                onClick={orderHandler}
                disabled={selectedItemsCount === 0}
                className="w-full bg-blue-900 text-white py-3 lg:py-3.5 rounded-xl hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-base lg:text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>Pesan Sekarang</span>
                <FaWhatsapp className="text-xl lg:text-2xl" />
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Pesan akan lansung terkirim menuju WhatsApp admin setelah klik
              pesan sekarang, terima kasih
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Summary - Fixed Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 safe-bottom">
        <div className="px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Total Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 mb-0.5">
                Total ({selectedItemsCount} produk)
              </p>
              <p className="font-bold text-base sm:text-lg text-blue-900 truncate">
                Rp {totalSelected.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Order Button */}
            <button
              onClick={orderHandler}
              disabled={selectedItemsCount === 0}
              className="bg-blue-900 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-sm sm:text-base flex items-center gap-2 shadow-lg flex-shrink-0"
            >
              <span>Pesan</span>
              <FaWhatsapp className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
