import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Relasi ke User Customer (jika user sudah login)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCustomer",
      required: false, // Opsional, untuk guest checkout
    },

    // Data pelanggan (auto-fill dari user login atau manual input)
    customerName: {
      type: String,
      required: [true, "Nama pelanggan wajib diisi."],
      trim: true,
    },

    customerPhone: {
      type: String,
      required: [true, "Nomor telepon wajib diisi."],
      trim: true,
    },

    // Tipe order: 'registered' (user login) atau 'guest' (tanpa login)
    orderType: {
      type: String,
      enum: ["registered", "guest"],
      default: "guest",
    },

    // Detail produk yang dipesan
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Catalog",
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        productPrice: {
          type: Number,
          required: true,
        },
        productImage: {
          url: String,
          publicId: String,
        },
        selectedColor: {
          type: String,
          required: true,
        },
        selectedSize: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],

    // Total harga
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Status pemesanan
    status: {
      type: String,
      enum: ["pending", "verified", "cancelled", "completed"],
      default: "pending",
    },

    // Timestamp verifikasi/pembatalan
    verifiedAt: {
      type: Date,
    },

    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "orders",
  }
);

// INDEX
orderSchema.index({ status: 1 });
orderSchema.index({ customerPhone: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "items.productId": 1 });
orderSchema.index({ userId: 1 }); // Index untuk user yang login
orderSchema.index({ orderType: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;