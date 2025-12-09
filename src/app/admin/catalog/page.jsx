import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import CatalogTable from "./CatalogTable"; // Komponen Klien yang akan kita buat
export const dynamic = "force-dynamic";

// 1. Fungsi fetch data (berjalan di server)
async function fetchCatalogs() {
  try {
    // Gunakan 'fetch' bawaan Next.js, bukan 'axios'
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/catalogs`,
      {
        cache: "no-store", // Selalu ambil data baru (penting untuk admin)
      }
    );

    // fetch tidak melempar error, jadi cek manual
    if (!response.ok) {
      console.error("Gagal mengambil data catalogs:", response.status);
      return [];
    }

    const responseData = await response.json();
    const data = Array.isArray(responseData.data) ? responseData.data : [];
    return data;
  } catch (error) {
    console.error("Gagal mengambil data catalog : ", error);
    return []; // Kembalikan array kosong jika gagal
  }
}

// 2. Page component (Async Server Component)
export default async function CatalogPage() {
  // 3. Panggil fungsi fetch langsung di dalam komponen
  const catalogs = await fetchCatalogs();

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
          KATALOG
        </h1>
      </div>

      {/* Tombol Tambah (Responsif) */}
      <div className="mt-6 sm:mt-8 px-4 flex flex-col w-full sm:w-[150px]">
        <Link
          href="/admin/catalog/createCatalog" // Sesuaikan path jika perlu (createCatalog -> create)
          className="flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          <span>Tambah</span>
        </Link>
      </div>

      {/* 4. Render Komponen Klien dan oper 'catalogs' sebagai props */}
      <div className="mx-auto max-w-[1171px] mt-6 sm:mt-8 md:mt-10 px-4 mb-10">
        <CatalogTable initialCatalogs={catalogs} />
      </div>
    </div>
  );
}
