"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

import EmptyCart from "./components/EmptyCart";
import UnauthenticatedCart from "./components/UnauthenticatedCart";
import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSummary";
export default function CartPage() {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [cart, setCart] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { refreshCart } = useCart();

  // Ambil user yang login dari cookie token
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/customer/me`,
          { withCredentials: true },
        );

        const data = res.data;

        if (data?.user?.id) {
          setUserId(data.user.id);
          setUserData(data.user);
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
        const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          withCredentials: true,
        });

        console.log("Cart data received:", res.data); // Debug log

        setCart(res.data.cart);

        // Select all items by default
        if (res.data.cart?.items) {
          setSelectedItems(res.data.cart.items.map((item) => item.id));
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
      setSelectedItems(cart.items.map((item) => item.id));
    }
  };

  // Update quantity (tambah/kurang)
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const res = await api.put(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/update`,
        { itemId, quantity: newQuantity },
        { withCredentials: true },
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
      const res = await api.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/item/${itemId}`,
        { withCredentials: true },
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

  // Get item price (from variant or product)
  const getItemPrice = (item) => {
    // Backend Sequelize mengembalikan data varian di variantDetails (GET /cart)
    if (item.variantDetails?.productPrice) {
      return Number(item.variantDetails.productPrice);
    }
    
    // Response dari POST /cart/add atau PUT /cart/update me-return objek variant secara langsung
    if (item.variant?.productPrice) {
      return Number(item.variant.productPrice);
    }

    // 1. Check if price is stored directly in cart item
    if (item.price) return Number(item.price);

    // 2. Find variant by variantId and get its price
    if (item.variantId && item.product?.variants) {
      const variant = item.product.variants.find(
        (v) => v.id === item.variantId,
      );
      if (variant?.productPrice) return Number(variant.productPrice);
    }

    // 3. If only one variant, use its price
    if (item.product?.variants?.length > 0) {
      return Number(item.product.variants[0].productPrice) || 0;
    }

    // 4. Fallback to legacy productPrice
    return Number(item.product?.productPrice) || 0;
  };

  // Hitung total harga item yang dipilih
  const calculateSelectedTotal = () => {
    if (!cart || !cart.items) return 0;

    return cart.items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => {
        const price = getItemPrice(item);
        return total + price * item.quantity;
      }, 0);
  };

  // Get product image URL
  const getProductImageUrl = (item) => {
    // Cek apakah ada image di item (dari cart - variant image)
    if (item.image) {
      return item.image;
    }

    // Cek dari data varian backend Sequelize (GET /cart)
    if (item.variantDetails?.productImages?.length > 0) {
      const primaryImage = item.variantDetails.productImages.find((img) => img.isPrimary);
      return primaryImage?.url || item.variantDetails.productImages[0]?.url;
    }

    // Cek dari data varian backend Sequelize secara langsung (POST /cart/add & PUT /cart/update)
    if (item.variant?.productImages?.length > 0) {
      const primaryImage = item.variant.productImages.find((img) => img.isPrimary);
      return primaryImage?.url || item.variant.productImages[0]?.url;
    }

    const product = item.product || {};

    // Cek apakah ada productImages (array) di product
    if (
      product.productImages &&
      Array.isArray(product.productImages) &&
      product.productImages.length > 0
    ) {
      const primaryImage = product.productImages.find((img) => img.isPrimary);
      return primaryImage?.url || product.productImages[0]?.url;
    }

    // Cek variants di product
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0];
      if (variant.productImages && variant.productImages.length > 0) {
        const primaryImage = variant.productImages.find((img) => img.isPrimary);
        return primaryImage?.url || variant.productImages[0]?.url;
      }
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
  const orderHandler = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error("Keranjang Anda kosong!", {
        duration: 4000,
        position: "bottom-center",
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("Pilih minimal satu produk untuk dipesan!", {
        duration: 4000,
        position: "bottom-center",
      });
      return;
    }

    const itemsToOrder = cart.items.filter((item) =>
      selectedItems.includes(item.id),
    );

    const totalOrderAmount = calculateSelectedTotal();

    // 1. Save order to backend
    try {
      // Construct payload compatible with backend (inferred)
      const orderPayload = {
        userId: userId,
        customerName: userData?.username || "Guest",
        customerPhone: userData?.nomorhp || "-",
        items: itemsToOrder.map((item) => ({
          productId: item.product.id,
          variantId: item.variantId,
          productName: item.product.productName,
          quantity: item.quantity,
          // Cart might store as selectedColor/selectedSize or color/size
          selectedColor: item.selectedColor || item.color,
          selectedSize: item.selectedSize || item.size,
          price: getItemPrice(item),
          image: getProductImageUrl(item),
        })),
        totalAmount: totalOrderAmount,
        status: "pending",
      };

      console.log("=== ORDER PAYLOAD DEBUG ===", orderPayload);

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        orderPayload,
        { withCredentials: true },
      );

      console.log("Order response:", response.data);

      toast.success("Pesanan berhasil dibuat!", {
        duration: 3000,
        position: "bottom-center",
      });

      // 2. Open WhatsApp
      let message = `Halo, saya ${userData?.username || "Pelanggan"} (${
        userData?.nomorhp || "-"
      }).\nSaya ingin memesan:\n\n`;

      itemsToOrder.forEach((item, index) => {
        const product = item.product || {};
        const price = getItemPrice(item);
        message += `*Produk ${index + 1}:*\n`;
        message += `Nama: ${product.productName || "Tidak tersedia"}\n`;

        if (item.selectedColor || item.color) {
          message += `Warna: ${item.selectedColor || item.color}\n`;
        }

        if (item.selectedSize || item.size) {
          message += `Ukuran: ${item.selectedSize || item.size}\n`;
        }

        message += `Jumlah: ${item.quantity} pcs\n`;
        message += `Harga (per pcs): Rp ${price.toLocaleString("id-ID")}\n`;
        message += `Subtotal: Rp ${(price * item.quantity).toLocaleString("id-ID")}\n`;
        message += `\n`;
      });

      message += `*Total Keseluruhan: Rp ${totalOrderAmount.toLocaleString(
        "id-ID",
      )}*\n\n`;
      message += "Mohon info lanjut untuk total dan pengiriman. Terima kasih!";

      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = "62895415019150";
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Gunakan location.href agar tidak diblokir oleh browser (popup blocker)
      window.location.href = whatsappURL;

      // Optional: Refresh/Clear cart UI
      refreshCart();
    } catch (error) {
      console.error("Gagal membuat pesanan:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        `Gagal memproses pesanan: ${error.response?.data?.message || error.message}`,
        {
          duration: 4000,
          position: "bottom-center",
        },
      );
    }
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
    return <UnauthenticatedCart />;
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
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
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
                {cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    imgSrc={getProductImageUrl(item)}
                    itemPrice={getItemPrice(item)}
                    toggleSelectItem={toggleSelectItem}
                    updateQuantity={updateQuantity}
                    handleRemove={handleRemove}
                  />
                ))}
              </ul>
            </div>

            <CartSummary
              selectedItemsCount={selectedItems.length}
              totalSelected={totalSelected}
              orderHandler={orderHandler}
            />
          </div>
        )}
      </div>
    </div>
  );
}
