"use client";
import { FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CatalogCards({ item }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div
      className={`flex flex-col bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition border border-blue-900`}
    >
      <Link href={`/catalog/${item._id}`} className="block flex-grow">
        {/* Gambar seragam seperti contoh */}
        <div className="w-full h-80 aspect-[3/4] overflow-hidden border-b border-blue-900">
          {item.productImages
            ?.filter((img) => img.isPrimary) // hanya ambil gambar primary
            .map((img) => (
              <Image
                key={img.publicId}
                src={img.url}
                width={80}
                height={80}
                alt={item.productName}
                className="object-cover w-full h-full"
              />
            ))}
        </div>

        <div className="px-2 h-19 flex flex-col text-left">
          <h3 className="text-sm sm:text-sm md:text-lg lg:text-xl text-black my-1 truncate">
            {item.productName}
          </h3>

          <div className="flex items-baseline gap-1">
            <p className="text-sm sm:text-base text-[#011C83] font-medium">
              Rp
            </p>
            <p className="text-[#011C83] font-semibold text-base sm:text-lg md:text-xl">
              {item.productPrice?.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-2 pb-2 flex justify-between items-center">
        <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
          Stok: {item.stock}
        </p>

        <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
          kategori: {item.category}
        </p>
      </div>
    </div>
  );
}
