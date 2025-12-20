import Order from "../models/orderModel.js";
import Catalog from "../models/catalogModel.js";

export const createOrder = async (req, res) => {
  try {
    let { customerName, customerPhone, items } = req.body;
    let userId = null;
    let orderType = "guest";

    if (req.currentUser) {
      userId = req.currentUser._id;
      orderType = "registered";
      // Auto-fill jika tidak diisi manual (sesuaikan dengan field di UserCustomer)
      customerName = customerName || req.currentUser.username;
      customerPhone = customerPhone || req.currentUser.nomorhp;
    }

    // Validasi input
    if (!customerName || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Data pelanggan dan produk wajib diisi.",
      });
    }
    // Validasi dan hitung total
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Catalog.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produk dengan ID ${item.productId} tidak ditemukan.`,
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Produk ${product.productName} tidak tersedia.`,
        });
      }

      // Cek stok
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stok ${product.productName} tidak mencukupi. Stok tersedia: ${product.stock}`,
        });
      }

      // Ambil gambar utama
      const primaryImage =
        product.productImages.find((img) => img.isPrimary) ||
        product.productImages[0];

      // Hitung subtotal
      const subtotal = product.productPrice * item.quantity;
      totalAmount += subtotal;

      processedItems.push({
        productId: product._id,
        productName: product.productName,
        productPrice: product.productPrice,
        productImage: primaryImage
          ? {
              url: primaryImage.url,
              publicId: primaryImage.publicId,
            }
          : null,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        subtotal: subtotal,
      });
    }

    // Buat order baru
    const newOrder = await Order.create({
      userId,
      orderType,
      customerName,
      customerPhone,
      items: processedItems,
      totalAmount,
      status: "pending",
    });

    // Populate data
    await newOrder.populate([
      { path: "items.productId" },
      { path: "userId", select: "username nomorhp" },
    ]);

    res.status(201).json({
      success: true,
      message: "Pesanan berhasil dibuat.",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Gagal membuat pesanan.",
      error: error.message,
    });
  }
};

// VERIFY ORDER (Admin verifikasi, stok berkurang)
export const verifyOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan.",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Order sudah dalam status ${order.status}.`,
      });
    }

    // Kurangi stok untuk setiap item
    for (const item of order.items) {
      const product = await Catalog.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produk ${item.productName} tidak ditemukan.`,
        });
      }

      // Cek stok sekali lagi
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stok ${product.productName} tidak mencukupi. Tersisa: ${product.stock}`,
        });
      }

      // Kurangi stok
      product.stock -= item.quantity;
      await product.save();
    }

    // Update status order
    order.status = "verified";
    order.verifiedAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: "Order berhasil diverifikasi dan stok telah dikurangi.",
      data: order,
    });
  } catch (error) {
    console.error("Error verifying order:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memverifikasi order.",
      error: error.message,
    });
  }
};

// CANCEL ORDER (Admin batalkan, stok tetap/dikembalikan)
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan.",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order sudah dibatalkan.",
      });
    }

    const wasVerified = order.status === "verified";

    // Jika order sudah verified, kembalikan stok
    if (wasVerified) {
      for (const item of order.items) {
        const product = await Catalog.findById(item.productId);

        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    // Update status order
    order.status = "cancelled";
    order.cancelledAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: wasVerified
        ? "Order dibatalkan dan stok telah dikembalikan."
        : "Order dibatalkan.",
      data: order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Gagal membatalkan order.",
      error: error.message,
    });
  }
};

// GET ALL ORDERS (untuk admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, orderType, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (orderType) query.orderType = orderType;

    const orders = await Order.find(query)
      .populate("items.productId")
      .populate("userId", "username nomorhp")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data order.",
      error: error.message,
    });
  }
};

// GET ORDER BY ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("items.productId")
      .populate("userId", "username nomorhp");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data order.",
      error: error.message,
    });
  }
};

// GET USER'S ORDER HISTORY (untuk user yang login)
export const getUserOrderHistory = async (req, res) => {
  try {
    if (!req.currentUser) {
      return res.status(401).json({
        success: false,
        message: "Silakan login terlebih dahulu.",
      });
    }

    const { status, page = 1, limit = 10 } = req.query;

    const query = { userId: req.currentUser._id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("items.productId")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil riwayat pesanan.",
      error: error.message,
    });
  }
};
