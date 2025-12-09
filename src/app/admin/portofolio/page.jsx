// File: PortofolioPage.jsx
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import PortofolioTable from "./portofolioTable";
export const dynamic = "force-dynamic";

// 1. Fungsi fetch data (berjalan di server)
async function fetchPortofolio() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/portofolio`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Gagal mengambil data portofolio:", response.status); // Ganti catalogs -> portofolio
      return [];
    }

    const responseData = await response.json();
    const data = Array.isArray(responseData.data) ? responseData.data : [];
    return data;
  } catch (error) {
    console.error("Gagal mengambil data portofolio : ", error); // Ganti catalog -> portofolio
    return [];
  }
}

// 2. Page component (Async Server Component)
export default async function PortofolioPage() {
  // 3. Panggil fungsi fetch langsung di dalam komponen
  const portofoliosData = await fetchPortofolio(); // Ganti 'catalogs' menjadi 'portofoliosData' agar konsisten

  return (
    <div className="w-full">
      {/* Header (Responsif) - Tidak ada perubahan */}
      <div className="relative w-full h-32 sm:h-40 md:h-48 mt-6 sm:mt-8 md:mt-10 mx-auto max-w-[1171px] px-4">
        <img
          src="/assetgambar/imageStore.webp"
          alt="Header"
          className="absolute inset-0 w-full h-full object-cover shadow-md rounded-lg"
        />
        <div className="absolute inset-0 bg-neutral-700/20 rounded-lg backdrop-blur-sm" />
        <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins">
          PORTOFOLIO
        </h1>
      </div>

      {/* Tombol Tambah (Responsif) - Tidak ada perubahan */}
      <div className="mt-6 sm:mt-8 px-4 flex flex-col w-full sm:w-[150px]">
        <Link
          href="/admin/portofolio/createdPortofolio"
          className="flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          <span>Tambah</span>
        </Link>
      </div>

      {/* 4. Render Komponen Klien dan oper 'portofoliosData' sebagai props */}
      <div className="mx-auto max-w-[1171px] mt-6 sm:mt-8 md:mt-10 px-4 mb-10">
        {/* PERBAIKAN: Gunakan variabel 'portofoliosData' */}
        <PortofolioTable initialPortofolios={portofoliosData} />
      </div>
    </div>
  );
}
