"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Poppins } from "next/font/google";
import ArticleCard from "@/components/ArticleCard";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function ArticlesPage() {
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtikels = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/articles`
        );
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setArtikels(data);
      } catch (error) {
        console.error("Gagal mengambil data artikel:", error);
        setArtikels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtikels();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-20 text-center">
        <p className="text-gray-600 text-lg">Memuat data artikel...</p>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          className={`text-5xl font-semibold text-center text-black mb-16 ${poppins.className}`}
        >
          Artikel
        </h2>

        {artikels.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Belum ada artikel yang tersedia.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {artikels.map((item, index) => (
              <ArticleCard key={index} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
