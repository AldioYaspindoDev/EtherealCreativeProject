"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import CatalogCards from "./CatalogCards";

const CatalogSection = ({ initialData = [], initialPagination = null }) => {
  const [catalogs, setCatalogs] = useState(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [pagination, setPagination] = useState(initialPagination);
  const [loadingMore, setLoadingMore] = useState(false);
  const hasFetched = useRef(false);

  const fetchCatalog = async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      console.log("Fetching from:", process.env.NEXT_PUBLIC_API_URL);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/catalogs?page=${page}&limit=20`,
      );

      const data = Array.isArray(response.data.data) ? response.data.data : [];

      if (append) {
        setCatalogs((prev) => [...prev, ...data]);
      } else {
        setCatalogs(data);
      }

      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Gagal mendapatkan data Catalog:", error.message);
      if (!append) setCatalogs([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (initialData.length === 0 && !hasFetched.current) {
      hasFetched.current = true;
      fetchCatalog(1, false);
    }
  }, [initialData]);

  if (loading) {
    return (
      <section className="w-full py-20 text-center">
        <p className="text-gray-600 text-lg">Memuat data Catalog...</p>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className={`text-5xl font-semibold text-center text-black mb-16`}>
          Catalog
        </h2>

        {catalogs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Belum ada catalog yang tersedia.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {catalogs.map((item, index) => (
                <CatalogCards key={index} item={item} />
              ))}
            </div>

            {/* Load More Button */}
            {pagination && pagination.page < pagination.pages && (
              <div className="text-center mt-8">
                <button
                  onClick={() => fetchCatalog(pagination.page + 1, true)}
                  disabled={loadingMore}
                  className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loadingMore ? "Memuat..." : "Muat Lebih Banyak"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CatalogSection;
