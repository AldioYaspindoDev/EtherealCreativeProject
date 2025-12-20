import axios from "axios";

// Ambil detail produk
export const fetchCatalogById = async (id) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/catalogs/${id}`
  );
  return response.data.data;
};

// Add to cart - FIXED VERSION
export const addToCart = async (productId, quantity = 1, options = {}) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Kirim cookies otomatis
      body: JSON.stringify({
        productId,
        quantity,
        color: options.color,
        size: options.size,
      }),
    });

    const data = await res.json();

    // Cek apakah backend mengirim 401 karena belum login
    if (res.status === 401) {
      throw {
        response: {
          status: 401,
          data: {
            requireAuth: true,
            message: data.message || "Silakan login terlebih dahulu",
          },
        },
      };
    }

    // Cek apakah request berhasil
    if (!res.ok) {
      throw {
        response: {
          status: res.status,
          data: {
            message: data.message || "Gagal menambahkan ke keranjang",
          },
        },
      };
    }

    return data;
  } catch (error) {
    console.error("Error add to cart:", error);
    throw error;
  }
};

// Alternative dengan axios (lebih konsisten)
export const addToCartAxios = async (productId, quantity = 1, options = {}) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
      {
        productId,
        quantity,
        color: options.color,
        size: options.size,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error add to cart:", error);

    // Format error untuk konsistensi
    if (error.response?.status === 401) {
      throw {
        response: {
          status: 401,
          data: {
            requireAuth: true,
            message:
              error.response.data?.message || "Silakan login terlebih dahulu",
          },
        },
      };
    }

    throw error;
  }
};

// Create Order (Database + WhatsApp)
export const createOrder = async (productId, quantity = 1, options = {}) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/orders`,
      {
        customerName: options.customerName,
        customerPhone: options.customerPhone,
        items: [
          {
            productId,
            quantity,
            selectedColor: options.color,
            selectedSize: options.size,
          },
        ],
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);

    if (error.response?.status === 401) {
      throw {
        response: {
          status: 401,
          data: {
            requireAuth: true,
            message:
              error.response.data?.message || "Silakan login terlebih dahulu",
          },
        },
      };
    }

    throw error;
  }
};
