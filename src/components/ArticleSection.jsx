"use client";

import { useEffect, useState } from "react";
import axios from "axios";
// Asumsi komponen ArticleCard tersedia
import ArticleCard from "@/components/ArticleCard";

export default function ArticlesPage() {
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Implementasi Exponential Backoff sederhana untuk fetch API
  const fetchArtikels = async (retries = 3) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`
      );
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setArtikels(data);
    } catch (error) {
      if (retries > 0 && error.response && error.response.status === 429) {
        const delay = Math.pow(2, 3 - retries) * 1000; // 1s, 2s, 4s
        // console.warn(`Rate limit hit, retrying in ${delay / 1000}s...`); // Tidak mencatat retry
        await new Promise((resolve) => setTimeout(resolve, delay));
        await fetchArtikels(retries - 1);
      } else {
        console.error(
          "Gagal mengambil data artikel setelah beberapa kali coba:",
          error
        );
        setArtikels([]);
      }
    } finally {
      if (retries === 3 || retries === 0) {
        // Hanya atur loading false setelah percobaan pertama atau terakhir
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchArtikels();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 md:py-20 text-center bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-black mb-16">
            Artikel
          </h2>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#001E91] border-gray-200"></div>
            <p className="text-gray-600 text-lg ml-4">Memuat data artikel...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Padding Horizontal yang Lebih Detail */}
        <h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-black mb-10 md:mb-16`} // Ukuran judul responsif dan margin bawah disesuaikan
        >
          Artikel
        </h2>
        {artikels.length === 0 ? (
          <p className="text-center text-gray-600 text-base sm:text-lg">
            Belum ada artikel yang tersedia.
          </p>
        ) : (
          // PERUBAHAN: Dihapus komentar JSX yang menyebabkan error.
          // grid-cols-2 -> 2 kolom di mobile (default)
          // md:grid-cols-3 -> 3 kolom di desktop (md)
          // Gap disesuaikan: gap-4 di mobile, membesar hingga lg:gap-12 di desktop
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {artikels.map((item, index) => (
              <ArticleCard key={index} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
