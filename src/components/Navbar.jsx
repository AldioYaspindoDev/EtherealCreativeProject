"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { IoSearch, IoClose } from "react-icons/io5";
import axios from "axios";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Search Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        setShowDropdown(true);
        try {
          // Attempt to use the search endpoint if available, or fallback/adjust based on project structure
          // Based on previous code: catalogs/search?q=
          const searchUrl = `${
            process.env.NEXT_PUBLIC_API_URL
          }/catalogs/search?q=${searchQuery.trim()}`;
          const responseSearch = await axios.get(searchUrl);

          setResults(responseSearch.data || []);
        } catch (error) {
          console.error("Error searching:", error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      // Optional: Navigate to a dedicated search page if needed
      // router.push(`/catalog?q=${searchQuery}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Catalog", href: "/catalog" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block relative w-[120px] sm:w-[150px]">
              <Image
                src="/assetgambar/MainLogo.png"
                alt="Logo Ethereal"
                width={150}
                height={40}
                priority
                className="w-full h-auto object-contain"
              />
            </Link>
          </div>

          {/* Search Bar - Desktop & Tablet */}
          <div
            className="flex-1 max-w-md hidden md:block relative z-50"
            ref={searchRef}
          >
            <form onSubmit={handleManualSearch} className="relative group">
              <div
                className={`flex items-center bg-gray-50 border transition-all duration-300 rounded-full px-4 py-2.5
                ${
                  showDropdown
                    ? "border-[#001E91] ring-2 ring-[#001E91]/10 bg-white"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
              >
                <IoSearch
                  className={`text-xl transition-colors ${
                    showDropdown ? "text-[#001E91]" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="flex-1 bg-transparent border-none outline-none ml-3 text-gray-700 placeholder-gray-400 text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim()) setShowDropdown(true);
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-1 hover:bg-gray-200 rounded-full transition"
                  >
                    <IoClose className="text-lg text-gray-400" />
                  </button>
                )}
              </div>

              {/* Dropdown Results */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      <div className="w-6 h-6 border-2 border-[#001E91] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      Mencari...
                    </div>
                  ) : results.length > 0 ? (
                    <>
                      <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                        {results.map((product) => (
                          <div
                            key={product._id}
                            onClick={() => {
                              router.push(`/catalog/${product._id}`);
                              setShowDropdown(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-none"
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                              {product.productImages?.find(
                                (img) => img.isPrimary
                              )?.url ? (
                                <Image
                                  src={
                                    product.productImages.find(
                                      (img) => img.isPrimary
                                    ).url
                                  }
                                  alt={product.productName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                  IMG
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-800 truncate">
                                {product.productName}
                              </h4>
                              <p className="text-xs text-[#001E91] font-semibold mt-0.5">
                                Rp{" "}
                                {product.productPrice?.toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 px-2 pb-1">
                        <Link
                          href="/catalog"
                          className="block w-full text-center py-2 text-xs font-semibold text-[#001E91] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Lihat Semua Produk
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-500 text-sm">
                        Tidak ada hasil ditemukan.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Nav Items & Cart */}
          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-1 group ${
                    pathname === item.href
                      ? "text-[#001E91]"
                      : "text-gray-600 hover:text-[#001E91]"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#001E91] transform origin-left transition-transform duration-300 ease-out ${
                      pathname === item.href
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/keranjang"
                className="p-2.5 rounded-full hover:bg-gray-100 transition-all text-gray-700 hover:text-[#001E91] relative group"
              >
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleMenu}
                className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                {isMenuOpen ? (
                  <FaTimes className="text-xl" />
                ) : (
                  <FaBars className="text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 w-[280px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex justify-between items-center bg-gray-50 border-b border-gray-100">
          <span className="font-semibold text-gray-800">Menu</span>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-500"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {/* Mobile Search Input */}
          <div className="mb-6">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2.5">
              <IoSearch className="text-gray-500 text-lg mr-2" />
              <input
                type="text"
                placeholder="Cari..."
                className="bg-transparent border-none outline-none w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    toggleMenu();
                  }
                }}
              />
            </div>
            {searchQuery && results.length > 0 && (
              <div className="mt-2 space-y-2">
                {results.slice(0, 3).map((p) => (
                  <div
                    key={p._id}
                    onClick={() => {
                      router.push(`/catalog/${p._id}`);
                      toggleMenu();
                    }}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 truncate">
                      {p.productName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={toggleMenu}
                className={`text-base font-medium px-4 py-3 rounded-xl transition-colors ${
                  pathname === item.href
                    ? "bg-[#001E91]/5 text-[#001E91]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
