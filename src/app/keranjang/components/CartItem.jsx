import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function CartItem({
  item,
  isSelected,
  imgSrc,
  itemPrice,
  toggleSelectItem,
  updateQuantity,
  handleRemove,
}) {
  const product = item.product || {};

  return (
    <li
      className={`bg-white border rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all ${
        isSelected
          ? "border-blue-900 bg-blue-50 shadow-md"
          : "border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelectItem(item.id)}
          className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-blue-900 mt-1 flex-shrink-0"
        />

        {/* Product Image */}
        <Link
          href={`/catalog/${product.id}`}
          className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 rounded-md overflow-hidden border border-gray-200"
        >
          <Image
            src={imgSrc}
            alt={product.productName || "Produk"}
            fill
            className="object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/catalog/${product.id}`}>
            <h2 className="text-sm sm:text-base md:text-lg font-medium text-black mb-1 line-clamp-2 hover:text-blue-900 transition">
              {product.productName || "Nama produk tidak tersedia"}
            </h2>
          </Link>

          {/* Color & Size */}
          {(item.selectedColor || item.color || item.selectedSize || item.size) && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
              {(item.selectedColor || item.color) && (
                <span className="flex items-center gap-1">
                  <span className="text-gray-500">Warna:</span>
                  <span className="font-medium">
                    {item.selectedColor || item.color}
                  </span>
                </span>
              )}
              {(item.selectedColor || item.color) &&
                (item.selectedSize || item.size) && (
                  <span className="text-gray-400">•</span>
                )}
              {(item.selectedSize || item.size) && (
                <span className="flex items-center gap-1">
                  <span className="text-gray-500">Ukuran:</span>
                  <span className="font-medium">
                    {item.selectedSize || item.size}
                  </span>
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <p className="text-sm sm:text-base md:text-lg font-semibold text-blue-900 mb-3">
            Rp {itemPrice.toLocaleString("id-ID")}
          </p>

          {/* Quantity Controls & Actions */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center gap-1 sm:gap-2 border border-blue-900 rounded-lg">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base text-blue-900 sm:text-lg transition-colors"
              >
                −
              </button>
              <span className="px-2 sm:px-3 py-1 min-w-[32px] sm:min-w-[40px] text-center font-medium text-sm sm:text-base text-blue-900">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-gray-100 font-bold text-base text-blue-900 sm:text-lg transition-colors"
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <div className="flex items-center gap-2 sm:gap-3">
              <p className="text-sm sm:text-base font-bold text-blue-900">
                Rp {(itemPrice * item.quantity).toLocaleString("id-ID")}
              </p>

              {/* Delete Button */}
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-600 hover:text-red-700 hover:underline text-xs sm:text-sm font-medium transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
