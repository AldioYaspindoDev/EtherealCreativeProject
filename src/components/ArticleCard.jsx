import { Poppins } from "next/font/google";
import Link from "next/link";
// Tidak perlu "use client" di sini jika ini adalah komponen presentasional murni
// (kecuali jika ada event handler yang kompleks yang memerlukannya)

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function ArticleCard({ item }) {
  console.log("Cek Data Item:", item);
  // Pastikan item memiliki properti yang diperlukan untuk mencegat error
  const title = item.judulArtikel || "Judul Tidak Tersedia";
  const excerpt = item.isiArtikel
    ? item.isiArtikel.slice(0, 60)
    : "Tidak ada deskripsi singkat.";
  const linkHref = item.id ? `/articles/${item.id}` : "#";

  return (
    <article
      // Memastikan kartu mengisi tinggi kolomnya dan memiliki tampilan yang bagus
      className={`flex flex-col bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:shadow-gray-300 transition duration-300 transform hover:-translate-y-0.5 ${poppins.className} h-full`}
    >
      {/* Container Gambar: Tinggi responsif, lebih kecil di mobile untuk keseimbangan */}
      <div className="w-full h-[160px] sm:h-[200px] md:h-[220px] overflow-hidden">
        <img
          src={
            item.imageUrl ||
            "https://placehold.co/600x400/D1D5DB/1F2937?text=No+Image"
          }
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Konten Teks */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
        {/* Judul: Ukuran font responsif, dibatasi 2 baris */}
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-black mb-2 leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Deskripsi: Ukuran font kecil di mobile, dibatasi 2 baris untuk mobile, 3 baris untuk desktop */}
        <p className="text-gray-600 text-xs sm:text-sm md:text-base flex-grow mb-2 sm:mb-3 overflow-hidden line-clamp-2 sm:line-clamp-3">
          {excerpt}...
        </p>

        {/* Link Baca Selengkapnya */}
        <Link
          href={linkHref}
          className="text-[#001E91] font-medium underline hover:text-blue-800 transition mt-auto text-xs sm:text-sm"
        >
          Baca Selengkapnya
        </Link>
      </div>
    </article>
  );
}
