// ========== ArticlePage.jsx ==========
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import ArticleTable from "./ArticleTable";
export const dynamic = "force-dynamic";

async function fetchArtikels() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data dari server");
    }
    const responseData = await response.json();
    const data = Array.isArray(responseData.data) ? responseData.data : [];
    return data;
  } catch (error) {
    console.error("Gagal mengambil data artikel : ", error);
    return [];
  }
}

export default async function ArtikelPage() {
  const artikels = await fetchArtikels();

  return (
    <div className="w-full">
      {/* Header (Responsif) */}
      <div className="relative w-full h-32 sm:h-40 md:h-48 mt-6 sm:mt-8 md:mt-10 mx-auto max-w-[1171px] px-4">
        <img
          src="/assetgambar/imageStore.webp"
          alt="Header"
          className="absolute inset-0 w-full h-full object-cover shadow-md rounded-lg"
        />
        <div className="absolute inset-0 bg-neutral-700/20 rounded-lg backdrop-blur-sm" />
        <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins">
          ARTIKEL
        </h1>
      </div>

      {/* Tombol Tambah (Responsif) */}
      <div className="mt-6 sm:mt-8 px-4 flex flex-col w-full sm:w-[140px]">
        <Link
          href="/admin/article/createArticle"
          className="flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          <span>Tambah</span>
        </Link>
      </div>

      {/* Render Komponen Klien */}
      <div className="mx-auto max-w-[1171px] mt-6 sm:mt-8 md:mt-10 px-4 mb-10">
        <ArticleTable initialArtikels={artikels} />
      </div>
    </div>
  );
}
