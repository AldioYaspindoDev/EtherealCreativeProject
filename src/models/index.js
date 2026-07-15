// src/models/index.js
// Central file: import semua model agar asosiasi terdaftar & sync berjalan benar
import sequelize from '../config/sequelize.js';

import UserAdmin, { AdminToken }                     from './userAdminModel.js';
import UserCustomer, { UserToken }                   from './userCustomerModel.js';
import Catalog, { CatalogVariant, VariantImage }     from './catalogModel.js';
import Order, { OrderItem }                          from './orderModel.js';
import Cart, { CartItem }                            from './keranjangModel.js';
import Portofolio                                    from './portofolioModel.js';
import Article                                       from './articleModel.js';
import Feedback                                      from './feedbackModel.js';

// ─── Cross-model Associations ─────────────────────────────────────────────────

// Order → UserCustomer (nullable FK)
Order.belongsTo(UserCustomer, { foreignKey: 'userId', as: 'user', constraints: false });
UserCustomer.hasMany(Order,   { foreignKey: 'userId', as: 'orders' });

// OrderItem → Catalog (nullable FK — produk bisa dihapus, history tetap ada)
OrderItem.belongsTo(Catalog, { foreignKey: 'productId', as: 'product', constraints: false });

// Cart → UserCustomer
Cart.belongsTo(UserCustomer, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
UserCustomer.hasOne(Cart,    { foreignKey: 'userId', as: 'cart' });

// CartItem → Catalog & CatalogVariant
CartItem.belongsTo(Catalog,        { foreignKey: 'productId', as: 'product', constraints: false });
CartItem.belongsTo(CatalogVariant, { foreignKey: 'variantId', as: 'variant', constraints: false });

// ─── Sync helper ─────────────────────────────────────────────────────────────
/**
 * syncDB({ force: false, alter: false })
 * - force: true  → DROP + CREATE (berbahaya di production!)
 * - alter: true  → ALTER TABLE sesuai model (aman untuk dev)
 */
export async function syncDB(options = {}) {
  await sequelize.sync(options);
  console.log('✅ All tables synced successfully');
}

export {
  sequelize,
  UserAdmin, AdminToken,
  UserCustomer, UserToken,
  Catalog, CatalogVariant, VariantImage,
  Order, OrderItem,
  Cart, CartItem,
  Portofolio,
  Article,
  Feedback,
};
