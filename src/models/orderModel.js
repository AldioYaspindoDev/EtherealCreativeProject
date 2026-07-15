// src/models/orderModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

// ─── Order ────────────────────────────────────────────────────────────────────
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,      // Opsional — untuk guest checkout
    field: 'user_id',
  },
  customerName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'customer_name',
    validate: {
      notEmpty: { msg: 'Nama pelanggan wajib diisi.' },
    },
  },
  customerPhone: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: 'customer_phone',
    validate: {
      notEmpty: { msg: 'Nomor telepon wajib diisi.' },
    },
  },
  orderType: {
    type: DataTypes.ENUM('registered', 'guest'),
    defaultValue: 'guest',
    field: 'order_type',
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'total_amount',
    validate: {
      min: { args: [0], msg: 'Total amount tidak boleh negatif.' },
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'verified', 'cancelled', 'completed'),
    defaultValue: 'pending',
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'verified_at',
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'cancelled_at',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at',
  },
}, {
  tableName: 'orders',
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['customer_phone'] },
    { fields: ['created_at'] },
    { fields: ['user_id'] },
    { fields: ['order_type'] },
  ],
});

// ─── OrderItem ────────────────────────────────────────────────────────────────
export const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'order_id',
  },
  productId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,      // Simpan ID produk saat order dibuat; produk bisa dihapus belakangan
    field: 'product_id',
  },
  productName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'product_name',
  },
  productPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'product_price',
  },
  productImageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'product_image_url',
  },
  productImagePublicId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'product_image_public_id',
  },
  selectedColor: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'selected_color',
  },
  selectedSize: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'selected_size',
  },
  quantity: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: { args: [1], msg: 'Quantity minimal 1.' },
    },
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'order_items',
  timestamps: false,
  indexes: [
    { fields: ['order_id'] },
    { fields: ['product_id'] },
  ],
});

// ─── Associations ─────────────────────────────────────────────────────────────
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

export default Order;
