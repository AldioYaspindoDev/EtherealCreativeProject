"use client";
import Image from "next/image";
import Link from "next/link";

export default function CatalogCards({ item }) {
  // Helper functions for variant data
  const getMinPrice = (variants) => {
    if (!variants || variants.length === 0) return 0;
    const prices = variants
      .map((v) => v.productPrice || 0)
      .filter((p) => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const getTotalStock = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

  const getPrimaryImage = (variants) => {
    if (!variants || variants.length === 0) return null;

    // Check each variant for a primary image
    for (const variant of variants) {
      if (variant.productImages && variant.productImages.length > 0) {
        const primary = variant.productImages.find((img) => img.isPrimary);
        if (primary) return primary;
        // Fall back to first image of first variant
        return variant.productImages[0];
      }
    }
    return null;
  };

  const minPrice = getMinPrice(item.variants);
  const totalStock = getTotalStock(item.variants);
  const primaryImage = getPrimaryImage(item.variants);
  const hasMultipleVariants = item.variants && item.variants.length > 1;

  return (
    <div
      className={`flex flex-col bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition border border-blue-900 h-full`}
    >
      <Link href={`/catalog/${item._id}`} className="block flex-grow">
        {/* Product Image */}
        <div className="w-full h-[200px] sm:h-[240px] md:h-[280px] aspect-[3/4] overflow-hidden border-b border-blue-900">
          {primaryImage ? (
            <Image
              key={primaryImage.publicId}
              src={primaryImage.url}
              width={80}
              height={80}
              alt={item.productName}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>

        <div className="px-3 py-2 sm:px-3 sm:py-2.5 flex flex-col text-left">
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg text-black mb-1 line-clamp-2">
            {item.productName}
          </h3>

          <div className="flex items-baseline gap-1">
            {hasMultipleVariants && (
              <p className="text-[10px] sm:text-xs text-gray-500">Mulai</p>
            )}
            <p className="text-xs sm:text-sm text-[#011C83] font-medium">Rp</p>
            <p className="text-[#011C83] font-semibold text-sm sm:text-base md:text-lg">
              {minPrice?.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-3 pb-2 flex justify-between items-center gap-2">
        <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 font-medium truncate">
          Stok: {totalStock}
        </p>

        <div className="flex items-center gap-2">
          {hasMultipleVariants && (
            <span className="text-[9px] sm:text-[10px] md:text-xs text-blue-600 font-medium">
              {item.variants.length} varian
            </span>
          )}
          <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 font-medium truncate">
            {item.category}
          </p>
        </div>
      </div>
    </div>
  );
}
