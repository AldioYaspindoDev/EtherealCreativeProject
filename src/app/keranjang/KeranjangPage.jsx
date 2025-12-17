"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { refreshCart } = useCart();

  // Ambil user yang login dari cookie token
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/customer/me`,
          { withCredentials: true }
        );

        const data = res.data;

        if (data?.user?._id) {
          setUserId(data.user._id);
        } else {
          console.log("User belum login");
        }
      } catch (err) {
        console.error("Gagal fetch user: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  // Ambil cart user
  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          withCredentials: true,
        });

        console.log("Cart data received:", res.data); // Debug log

        setCart(res.data.cart);

        // Select all items by default
        if (res.data.cart?.items) {
          setSelectedItems(res.data.cart.items.map((item) => item._id));
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        toast.error("Gagal memuat keranjang", {
          duration: 3000,
          position: "bottom-center",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  // Toggle checkbox item
  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Select/Deselect All
  const toggleSelectAll = () => {
    if (selectedItems.length === cart.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.items.map((item) => item._id));
    }
  };

  // Update quantity (tambah/kurang)
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/update`,
        { itemId, quantity: newQuantity },
        { withCredentials: true }
      );

      setCart(res.data.cart);
      refreshCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Gagal mengubah jumlah produk", {
        duration: 4000,
        position: "bottom-center",
        style: {
          background: "#ffffff",
          color: "black",
          padding: "16px 20px",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(245, 87, 108, 0.4)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          minWidth: "320px",
        },
      });
    }
  };

  // Hapus item
  const handleRemove = async (itemId) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/item/${itemId}`,
        { withCredentials: true }
      );

      setCart(res.data.cart);
      refreshCart();
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));

      toast.success("Produk dihapus dari keranjang", {
        duration: 2000,
        position: "bottom-center",
      });
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Gagal menghapus produk", {
        duration: 4000,
        position: "bottom-center",
        style: {
          background: "#ffffff",
          color: "black",
          padding: "16px 20px",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(245, 87, 108, 0.4)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          minWidth: "320px",
        },
      });
    }
  };

  // Hitung total harga item yang dipilih
  const calculateSelectedTotal = () => {
    if (!cart || !cart.items) return 0;

    return cart.items
      .filter((item) => selectedItems.includes(item._id))
      .reduce((total, item) => {
        const product = item.product || {};
        return total + (product.productPrice || 0) * item.quantity;
      }, 0);
  };

  // Get product image URL
  const getProductImageUrl = (product) => {
    // Cek apakah ada productImages (array)
    if (
      product.productImages &&
      Array.isArray(product.productImages) &&
      product.productImages.length > 0
    ) {
      const primaryImage = product.productImages.find((img) => img.isPrimary);
      return primaryImage?.url || product.productImages[0]?.url;
    }

    // Fallback ke productImage (string)
    if (product.productImage) {
      return product.productImage.startsWith("http")
        ? product.productImage
        : `${process.env.NEXT_PUBLIC_API_URL}/${product.productImage}`;
    }

    // Default placeholder
    return "/placeholder.png";
  };

  // Handler untuk order via WhatsApp
  const orderHandler = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error("Keranjang Anda kosong!", {
        duration: 4000,
        position: "bottom-center",
        style: {
          background: "#ffffff",
          color: "black",
          padding: "16px 20px",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(245, 87, 108, 0.4)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          minWidth: "320px",
        },
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("Pilih minimal satu produk untuk dipesan!", {
        duration: 4000,
        position: "bottom-center",
        style: {
          background: "#ffffff",
          color: "black",
          padding: "16px 20px",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(245, 87, 108, 0.4)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          minWidth: "320px",
        },
      });
      return;
    }

    const itemsToOrder = cart.items.filter((item) =>
      selectedItems.includes(item._id)
    );

    let message = "Halo, saya ingin memesan:\n\n";

    itemsToOrder.forEach((item, index) => {
      const product = item.product || {};
      message += `*Produk ${index + 1}:*\n`;
      message += `Nama: ${product.productName || "Tidak tersedia"}\n`;

      if (item.color || product.productColor) {
        message += `Warna: ${item.color || product.productColor}\n`;
      }

      if (item.size || product.productSize) {
        message += `Ukuran: ${item.size || product.productSize}\n`;
      }

      message += `Jumlah: ${item.quantity} pcs\n`;
      message += `Harga (per pcs): Rp ${(
        product.productPrice || 0
      ).toLocaleString("id-ID")}\n`;
      message += `Subtotal: Rp ${(
        (product.productPrice || 0) * item.quantity
      ).toLocaleString("id-ID")}\n`;
      message += `\n`;
    });

    const totalSelected = calculateSelectedTotal();
    message += `*Total Keseluruhan: Rp ${totalSelected.toLocaleString(
      "id-ID"
    )}*\n\n`;
    message += "Mohon info lanjut untuk total dan pengiriman. Terima kasih!";

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "62895415019150";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  // No cart data
  if (!cart) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <div className="text-center max-w-md">
          {/* Icon / Illustration */}
          <div className="mb-6">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              className="mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
              <circle cx="9" cy="19" r="2" />
              <circle cx="17" cy="19" r="2" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-black mb-3">
            Keranjang Masih Kosong
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Kamu harus login terlebih dahulu sebelum bisa menambahkan produk ke
            keranjang.
          </p>

          {/* Login Button */}
          <Link
            href="/login"
            className="block w-full bg-blue-900 text-white py-3 rounded-xl text-lg font-medium hover:bg-blue-800 transition-all"
          >
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  const totalSelected = calculateSelectedTotal();

  return (
    <div className="min-h-screen bg-gray-50 pb-32 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
            Keranjang Belanja
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {cart.items?.length || 0} produk di keranjang
          </p>
        </div>

        {!cart.items || cart.items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm">
            <div className="mb-6">
              <svg
                width="100"
                height="100"
                viewBox="0 0 24 24"
                className="mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                <circle cx="9" cy="19" r="2" />
                <circle cx="17" cy="19" r="2" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Keranjang Masih Kosong
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Yuk, mulai belanja dan tambahkan produk ke keranjang!
            </p>
            <Link
              href="/catalog"
              className="inline-block bg-blue-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-800 transition-colors font-medium text-sm sm:text-base"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          /* Main Content - Two Column Layout on Desktop */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {/* Left Column - Cart Items (Desktop: 8/12, Mobile: full) */}
            <div className="md:col-span-8">
              {/* Select All */}
              <div className="flex items-center justify-between gap-2 p-3 sm:p-4 bg-white rounded-lg shadow-sm mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cart.items.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-blue-900"
                  />
                  <label
                    className="text-sm sm:text-base font-medium cursor-pointer select-none text-gray-500"
                    onClick={toggleSelectAll}
                  >
                    Pilih Semua
                  </label>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  {cart.items.length} produk
                </span>
              </div>

              {/* Cart Items List */}
              <ul className="space-y-3 sm:space-y-4">
                {cart.items.map((item) => {
                  const product = item.product || {};
                  const imgSrc = getProductImageUrl(product);
                  const isSelected = selectedItems.includes(item._id);

                  return (
                    <li
                      key={item._id}
                      className={`bg-white border rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all ${
                        isSelected
                          ? "border-blue-900 bg-blue-50 shadow-md"
                          : "border-gray-200 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item._id)}
                          className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-blue-900 mt-1 flex-shrink-0"
                        />

                        {/* Product Image */}
                        <Link
                          href={`/catalog/${product._id}`}
                          className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 rounded-md overflow-hidden border border-gray-200"
                        >
                          <Image
                            src={imgSrc}
                            alt={product.productName || "Produk"}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                            }}
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/catalog/${product._id}`}>
                            <h2 className="text-sm sm:text-base md:text-lg font-medium text-black mb-1 line-clamp-2 hover:text-blue-900 transition">
                              {product.productName ||
                                "Nama produk tidak tersedia"}
                            </h2>
                          </Link>

                          {/* Color & Size */}
                          {(item.color || item.size) && (
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
                              {item.color && (
                                <span className="flex items-center gap-1">
                                  <span className="text-gray-500">Warna:</span>
                                  <span className="font-medium">
                                    {item.color}
                                  </span>
                                </span>
                              )}
                              {item.color && item.size && (
                                <span className="text-gray-400">•</span>
                              )}
                              {item.size && (
                                <span className="flex items-center gap-1">
                                  <span className="text-gray-500">Ukuran:</span>
                                  <span className="font-medium">
                                    {item.size}
                                  </span>
                                </span>
                              )}
                            </div>
                          )}

                          {/* Price */}
                          <p className="text-sm sm:text-base md:text-lg font-semibold text-blue-900 mb-3">
                            Rp{" "}
                            {(product.productPrice || 0).toLocaleString(
                              "id-ID"
                            )}
                          </p>

                          {/* Quantity Controls & Actions - Mobile: Horizontal, Desktop: Better spacing */}
                          <div className="flex items-center justify-between gap-2 sm:gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1 sm:gap-2 border border-blue-900 rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className="px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base text-blue-900 sm:text-lg transition-colors"
                              >
                                −
                              </button>
                              <span className="px-2 sm:px-3 py-1 min-w-[32px] sm:min-w-[40px] text-center font-medium text-sm sm:text-base text-blue-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity + 1)
                                }
                                className="px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-gray-100 font-bold text-base text-blue-900 sm:text-lg transition-colors"
                              >
                                +
                              </button>
                            </div>

                            {/* Subtotal */}
                            <div className="flex items-center gap-2 sm:gap-3">
                              <p className="text-sm sm:text-base font-bold text-blue-900">
                                Rp{" "}
                                {(
                                  (product.productPrice || 0) * item.quantity
                                ).toLocaleString("id-ID")}
                              </p>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleRemove(item._id)}
                                className="text-red-600 hover:text-red-700 hover:underline text-xs sm:text-sm font-medium transition-colors"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right Column - Summary (Desktop: Sticky, Mobile: Fixed Bottom) */}
            {/* Desktop Summary - Sticky Right Column */}
            <div className="hidden md:block md:col-span-4">
              <div className="sticky top-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 lg:p-6 shadow-lg">
                  <h3 className="text-lg lg:text-xl font-bold text-black mb-4 lg:mb-5">
                    Ringkasan Belanja
                  </h3>

                  <div className="space-y-3 mb-4 lg:mb-5">
                    <div className="flex justify-between items-center text-sm lg:text-base">
                      <span className="text-gray-600">
                        Subtotal ({selectedItems.length} produk)
                      </span>
                      <span className="font-semibold text-black">
                        Rp {totalSelected.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Pengiriman</span>
                      <span className="text-gray-500 text-xs">
                        Dihitung di checkout
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 lg:pt-5 mb-5 lg:mb-6">
                    <div className="flex justify-between items-center mb-5 lg:mb-6">
                      <span className="font-bold text-lg lg:text-xl text-black">
                        Total
                      </span>
                      <span className="font-bold text-xl lg:text-2xl text-blue-900">
                        Rp {totalSelected.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <button
                      onClick={orderHandler}
                      disabled={selectedItems.length === 0}
                      className="w-full bg-blue-900 text-white py-3 lg:py-3.5 rounded-xl hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-base lg:text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <span>Pesan Sekarang</span>
                      <FaWhatsapp className="text-xl lg:text-2xl" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    Pesan akan lansung terkirim menuju WhatsApp admin setelah klik pesan
                    sekarang, terima kasih 
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Summary - Fixed Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 safe-bottom">
              <div className="px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between gap-3">
                  {/* Total Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">
                      Total ({selectedItems.length} produk)
                    </p>
                    <p className="font-bold text-base sm:text-lg text-blue-900 truncate">
                      Rp {totalSelected.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* Order Button */}
                  <button
                    onClick={orderHandler}
                    disabled={selectedItems.length === 0}
                    className="bg-blue-900 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-sm sm:text-base flex items-center gap-2 shadow-lg flex-shrink-0"
                  >
                    <span>Pesan</span>
                    <FaWhatsapp className="text-lg sm:text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
