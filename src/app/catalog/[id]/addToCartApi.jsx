import axios from "axios";

// Ambil detail produk
export const fetchCatalogById = async (id) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/catalogs/${id}`,
  );
  return response.data.data;
};

// Add to cart - Using axios for better compatibility
export const addToCart = async (productId, quantity = 1, options = {}) => {
  try {
    const payload = {
      productId,
      variantId: options.variantId,
      selectedColor: options.color,
      selectedSize: options.size,
      quantity,
    };

    console.log("=== SENDING TO BACKEND ===", payload);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
      payload,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error add to cart:", error);

    // Format error for consistency
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

    throw {
      response: {
        status: error.response?.status || 500,
        data: {
          message:
            error.response?.data?.message ||
            error.message ||
            "Gagal menambahkan ke keranjang",
        },
      },
    };
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
      },
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
      },
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
