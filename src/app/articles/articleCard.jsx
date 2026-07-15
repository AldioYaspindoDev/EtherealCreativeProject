import { Poppins } from "next/font/google";
import Link from "next/link";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function ArticleCard({ item }) {
  return (
    <div
      className={`flex flex-col bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition ${poppins.className}`}
    >
      <div className="w-full h-[300px] overflow-hidden">
        <img
          src={item.imageUrl || "/placeholder.jpg"}
          alt={item.judulArtikel}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-5 flex flex-col grow">
        <h3 className="text-2xl font-semibold text-black mb-3">
          {item.judulArtikel}
        </h3>
        <p className="text-gray-700 text-base grow mb-4">
          {item.isiArtikel?.slice(0, 40)}...
        </p>
        <Link
          href={`/articles/${item.id}`}
          className="text-blue-600 underline hover:text-blue-800 transition"
        >
          Baca Selengkapnya
        </Link>
      </div>
    </div>
  );
}
