"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
export default function ArticleContent() {
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/articles/${params.id}`
        );
        setArtikel(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data artikel:", error);
        setArtikel(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArtikel();
    }
  }, [params.id]);

  if (loading) {
    return (
      <section className="w-full py-20 text-center">
        <p className="text-gray-600 text-lg">Memuat artikel...</p>
      </section>
    );
  }

  if (!artikel) {
    return (
      <section className="w-full py-20 text-center">
        <p className="text-gray-600 text-lg">Artikel tidak ditemukan.</p>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen bg-gray-50">
      <Navbar />
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <nav className="text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/articles" className="hover:text-blue-600">
            Artikel
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{artikel.JudulArtikel}</span>
        </nav>
      </div>

      {/* Header Article */}
      <header className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {artikel.JudulArtikel}
        </h1>

        {artikel.ImageUrl && (
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg mb-8">
            <img
              src={artikel.ImageUrl}
              alt={artikel.JudulArtikel}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>

      {/* Article Content */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {artikel.IsiArtikel}
          </div>
        </div>

        <div className="mt-12 flex justify-between items-center">
          <Link
            href="/articles"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <span>←</span>
            <span>Kembali ke Daftar Artikel</span>
          </Link>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Kembali ke Atas ↑
          </button>
        </div>
      </section>
      <Footer />
    </section>
  );
}
