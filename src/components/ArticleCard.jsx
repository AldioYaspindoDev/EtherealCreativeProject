import { Poppins } from "next/font/google";
import Link from "next/link";
// Tidak perlu "use client" di sini jika ini adalah komponen presentasional murni
// (kecuali jika ada event handler yang kompleks yang memerlukannya)

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function ArticleCard({ item }) {
  // Pastikan item memiliki properti yang diperlukan untuk mencegah error
  const title = item.JudulArtikel || "Judul Tidak Tersedia";
  const excerpt = item.IsiArtikel
    ? item.IsiArtikel.slice(0, 80)
    : "Tidak ada deskripsi singkat.";
  const linkHref = item._id ? `/articles/${item._id}` : "#";

  return (
    <div
      // Memastikan kartu mengisi tinggi kolomnya dan memiliki tampilan yang bagus
      className={`flex flex-col bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:shadow-gray-300 transition duration-300 transform hover:-translate-y-0.5 ${poppins.className} h-full`}
    >
      {/* Container Gambar: Tinggi responsif, lebih kecil di mobile */}
      <div className="w-full h-[180px] sm:h-[220px] md:h-[250px] overflow-hidden">
        <img
          src={
            item.ImageUrl ||
            "https://placehold.co/600x400/D1D5DB/1F2937?text=No+Image"
          }
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Konten Teks */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Judul: Ukuran font responsif */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-2 sm:mb-3 leading-snug">
          {title}
        </h3>

        {/* Deskripsi: Ukuran font kecil di mobile, menggunakan truncate untuk menjaga tinggi */}
        <p className="text-gray-700 text-sm sm:text-base flex-grow mb-3 sm:mb-4 overflow-hidden line-clamp-3">
          {excerpt}
        </p>

        {/* Link Baca Selengkapnya */}
        <Link
          href={linkHref}
          className="text-[#001E91] font-medium underline hover:text-blue-800 transition mt-auto text-sm sm:text-base"
        >
          Baca Selengkapnya
        </Link>
      </div>
    </div>
  );
}
