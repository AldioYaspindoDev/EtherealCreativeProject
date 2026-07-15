// src/models/keranjangModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

// ─── Cart ─────────────────────────────────────────────────────────────────────
const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: true,           // Satu user hanya boleh punya 1 cart aktif
    field: 'user_id',
  },
  totalPrice: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'total_price',
  },
  status: {
    type: DataTypes.ENUM('active', 'checked_out'),
    defaultValue: 'active',
  },
}, {
  tableName: 'carts',
  timestamps: true,
  indexes: [
    { fields: ['user_id', 'status'] },
  ],
});

// ─── CartItem ─────────────────────────────────────────────────────────────────
export const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  cartId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'cart_id',
  },
  productId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'product_id',
  },
  variantId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'variant_id',
  },
  selectedColor: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'selected_color',
    validate: {
      notEmpty: { msg: 'Warna harus dipilih.' },
    },
  },
  selectedSize: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'selected_size',
    validate: {
      notEmpty: { msg: 'Ukuran harus dipilih.' },
    },
  },
  quantity: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: { args: [1], msg: 'Quantity minimal 1.' },
    },
  },
}, {
  tableName: 'cart_items',
  timestamps: false,
  indexes: [
    { fields: ['cart_id'] },
    { fields: ['product_id'] },
    { fields: ['variant_id'] },
  ],
});

// ─── Associations ─────────────────────────────────────────────────────────────
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

export default Cart;
