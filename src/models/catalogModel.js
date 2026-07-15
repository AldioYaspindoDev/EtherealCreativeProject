// src/models/catalogModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

// ─── Catalog ──────────────────────────────────────────────────────────────────
const Catalog = sequelize.define('Catalog', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  productName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'product_name',
    validate: {
      notEmpty: { msg: 'Product name wajib diisi.' },
    },
  },
  productDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'product_description',
    validate: {
      notEmpty: { msg: 'Deskripsi wajib diisi.' },
    },
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'catalogs',
  timestamps: true,
  indexes: [
    { fields: ['product_name'] },
    { fields: ['category'] },
    { fields: ['is_active'] },
    { fields: ['category', 'is_active'] },
    { fields: ['created_at'] },
  ],
});

// ─── CatalogVariant ───────────────────────────────────────────────────────────
export const CatalogVariant = sequelize.define('CatalogVariant', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  catalogId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'catalog_id',
  },
  color: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Warna wajib diisi.' },
    },
    set(value) {
      this.setDataValue('color', value?.trim());
    },
  },
  productPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'product_price',
    validate: {
      min: { args: [0], msg: 'Harga tidak boleh negatif.' },
    },
  },
  stock: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Stok tidak boleh negatif.' },
    },
  },
  // sizes disimpan sebagai JSON array: ["S","M","L","XL"]
  sizes: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      notEmpty(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Minimal 1 ukuran harus ditambahkan.');
        }
      },
    },
  },
}, {
  tableName: 'catalog_variants',
  timestamps: true,
  indexes: [
    { fields: ['catalog_id'] },
  ],
});

// ─── VariantImage ─────────────────────────────────────────────────────────────
export const VariantImage = sequelize.define('VariantImage', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  variantId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'variant_id',
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  publicId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'public_id',
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_primary',
  },
}, {
  tableName: 'variant_images',
  timestamps: false,
  indexes: [
    { fields: ['variant_id'] },
  ],
});

// ─── Associations ─────────────────────────────────────────────────────────────
Catalog.hasMany(CatalogVariant, { foreignKey: 'catalogId', as: 'variants', onDelete: 'CASCADE' });
CatalogVariant.belongsTo(Catalog, { foreignKey: 'catalogId' });

CatalogVariant.hasMany(VariantImage, { foreignKey: 'variantId', as: 'productImages', onDelete: 'CASCADE' });
VariantImage.belongsTo(CatalogVariant, { foreignKey: 'variantId' });

export default Catalog;
