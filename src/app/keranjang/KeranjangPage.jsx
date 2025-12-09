"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";

export default function CartPage() {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    <div className="p-6 max-w-4xl mx-auto text-black">
      <h1 className="text-2xl font-semibold mb-6">Keranjang Saya</h1>

      {!cart.items || cart.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Keranjang kamu masih kosong.</p>
          <Link
            href="/catalog"
            className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <>
          {/* Select All Checkbox */}
          <div className="mb-4 flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={selectedItems.length === cart.items.length}
              onChange={toggleSelectAll}
              className="w-5 h-5 cursor-pointer accent-blue-900"
            />
            <label
              className="font-medium cursor-pointer"
              onClick={toggleSelectAll}
            >
              Pilih Semua ({cart.items.length} produk)
            </label>
          </div>

          <ul className="space-y-4">
            {cart.items.map((item) => {
              const product = item.product || {};
              const imgSrc = getProductImageUrl(product);
              const isSelected = selectedItems.includes(item._id);

              return (
                <li
                  key={item._id}
                  className={`flex items-start gap-4 border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition ${
                    isSelected ? "border-blue-900 bg-blue-50" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectItem(item._id)}
                    className="w-5 h-5 cursor-pointer accent-blue-900 mt-1"
                  />

                  <Link
                    href={`/catalog/${product._id}`}
                    className="flex items-start gap-4 flex-1"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={imgSrc}
                        alt={product.productName || "Produk"}
                        fill
                        className="object-cover rounded-md border"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-lg font-medium">
                        {product.productName || "Nama produk tidak tersedia"}
                      </h2>

                      {/* Display color and size if available */}
                      <div className="text-sm text-gray-600 mt-1">
                        {item.color && <span>Warna: {item.color}</span>}
                        {item.color && item.size && (
                          <span className="mx-2">|</span>
                        )}
                        {item.size && <span>Ukuran: {item.size}</span>}
                      </div>

                      <p className="text-gray-700 font-semibold mt-2">
                        Rp {(product.productPrice || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </Link>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 min-w-[40px] text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100 font-bold text-lg transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="text-sm font-semibold text-blue-900">
                      Rp{" "}
                      {(
                        (product.productPrice || 0) * item.quantity
                      ).toLocaleString("id-ID")}
                    </p>

                    {/* Hapus Button */}
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-red-600 hover:underline text-sm font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Total & Order Button */}
      {cart.items && cart.items.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg border-t-2 border-blue-900">
          <div>
            <p className="text-sm text-gray-600">
              Total ({selectedItems.length} produk dipilih):
            </p>
            <p className="font-bold text-2xl text-blue-900">
              Rp {totalSelected.toLocaleString("id-ID")}
            </p>
          </div>
          <button
            onClick={orderHandler}
            disabled={selectedItems.length === 0}
            className="bg-blue-900 flex items-center gap-2 text-white px-6 py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold"
          >
            <span>Pesan Sekarang</span>
            <FaWhatsapp className="text-2xl" />
          </button>
        </div>
      )}
    </div>
  );
}
