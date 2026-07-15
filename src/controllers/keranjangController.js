// controllers/keranjangController.js
import Cart, { CartItem } from '../models/keranjangModel.js';
import Catalog, { CatalogVariant, VariantImage } from '../models/catalogModel.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../middleware/errorHandler.js';
import sequelize from '../config/sequelize.js';

const KeranjangController = {
  // ─── ADD TO CART ─────────────────────────────────────────────────────────────
  addToCart: catchAsync(async (req, res, next) => {
    const { productId, variantId, selectedColor, selectedSize, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || !variantId || !selectedColor || !selectedSize) {
      return next(new AppError('productId, variantId, selectedColor, dan selectedSize wajib diisi', 400));
    }

    const qtyToAdd = quantity || 1;

    const t = await sequelize.transaction();
    try {
      const product = await Catalog.findByPk(productId, { transaction: t });
      if (!product) { await t.rollback(); return next(new AppError('Produk tidak ditemukan', 404)); }
      if (!product.isActive) { await t.rollback(); return next(new AppError('Produk tidak tersedia', 400)); }

      const variant = await CatalogVariant.findOne({
        where: { id: variantId, catalogId: productId },
        include: [{ model: VariantImage, as: 'productImages' }],
        transaction: t,
      });
      if (!variant) { await t.rollback(); return next(new AppError('Variant tidak ditemukan', 404)); }

      // Pastikan sizes selalu berupa array (MySQL JSON column kadang dikembalikan sebagai string)
      const parsedSizes = Array.isArray(variant.sizes)
        ? variant.sizes
        : (() => { try { return JSON.parse(variant.sizes || '[]'); } catch { return []; } })();

      if (variant.color !== selectedColor) { await t.rollback(); return next(new AppError(`Warna "${selectedColor}" tidak tersedia untuk variant ini`, 400)); }
      if (!parsedSizes.includes(selectedSize)) { await t.rollback(); return next(new AppError(`Ukuran "${selectedSize}" tidak tersedia untuk variant ini. Pilihan: ${parsedSizes.join(', ')}`, 400)); }
      if (variant.stock < qtyToAdd) { await t.rollback(); return next(new AppError(`Stok tidak mencukupi. Stok tersedia: ${variant.stock}`, 400)); }

      // Cari atau buat cart aktif
      let [cart] = await Cart.findOrCreate({
        where: { userId },
        defaults: { userId, totalPrice: 0, status: 'active' },
        transaction: t,
      });

      // Cek apakah item sudah ada di cart
      const existingItem = await CartItem.findOne({
        where: { cartId: cart.id, productId, variantId, selectedColor, selectedSize },
        transaction: t,
      });

      if (existingItem) {
        const newQuantity = existingItem.quantity + qtyToAdd;
        if (variant.stock < qtyToAdd) {
          await t.rollback();
          return next(new AppError(`Stok tidak mencukupi. Anda sudah memiliki ${existingItem.quantity} item di keranjang. Stok tersedia: ${variant.stock}`, 400));
        }
        await existingItem.update({ quantity: newQuantity }, { transaction: t });
      } else {
        await CartItem.create({ cartId: cart.id, productId, variantId, selectedColor, selectedSize, quantity: qtyToAdd }, { transaction: t });
      }

      // Kurangi stok variant
      await variant.update({ stock: variant.stock - qtyToAdd }, { transaction: t });

      // Hitung ulang total price
      const allItems = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [{ model: CatalogVariant, as: 'variant' }],
        transaction: t,
      });

      const totalPrice = allItems.reduce((sum, itm) => {
        const price = itm.variant ? parseFloat(itm.variant.productPrice) : 0;
        return sum + price * itm.quantity;
      }, 0);

      await cart.update({ totalPrice }, { transaction: t });
      await t.commit();

      // Return cart dengan semua relasi
      const fullCart = await Cart.findByPk(cart.id, {
        include: [{
          model: CartItem, as: 'items',
          include: [
            { model: Catalog, as: 'product' },
            { model: CatalogVariant, as: 'variant', include: [{ model: VariantImage, as: 'productImages' }] },
          ],
        }],
      });

      res.status(200).json({ success: true, message: 'Produk berhasil ditambahkan ke keranjang', cart: fullCart });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }),

  // ─── GET CART ─────────────────────────────────────────────────────────────────
  getCart: catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: { userId },
      include: [{
        model: CartItem, as: 'items',
        include: [
          { model: Catalog, as: 'product' },
          { model: CatalogVariant, as: 'variant', include: [{ model: VariantImage, as: 'productImages' }] },
        ],
      }],
    });

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [], totalPrice: 0 } });
    }

    const enrichedItems = cart.items.map(item => ({
      id: item.id,
      product: item.product,
      variantId: item.variantId,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      variantDetails: item.variant ? {
        productPrice: item.variant.productPrice,
        stock: item.variant.stock,
        productImages: item.variant.productImages,
      } : null,
    }));

    res.status(200).json({
      success: true,
      cart: { id: cart.id, userId: cart.userId, items: enrichedItems, totalPrice: cart.totalPrice, status: cart.status },
    });
  }),

  // ─── UPDATE CART ITEM ─────────────────────────────────────────────────────────
  updateCartItem: catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;
    if (!itemId) return next(new AppError('Item ID harus disertakan', 400));

    const t = await sequelize.transaction();
    try {
      const cart = await Cart.findOne({ where: { userId }, transaction: t });
      if (!cart) { await t.rollback(); return next(new AppError('Keranjang tidak ditemukan', 404)); }

      const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id }, transaction: t });
      if (!item) { await t.rollback(); return next(new AppError('Item tidak ditemukan di keranjang', 404)); }

      const variant = await CatalogVariant.findByPk(item.variantId, { transaction: t });
      if (!variant) { await t.rollback(); return next(new AppError('Variant tidak ditemukan', 404)); }

      const oldQuantity = item.quantity;
      const quantityDiff = quantity - oldQuantity;

      if (quantityDiff > 0 && variant.stock < quantityDiff) {
        await t.rollback();
        return next(new AppError(`Stok tidak mencukupi. Stok tersedia: ${variant.stock}`, 400));
      }

      await variant.update({ stock: variant.stock - quantityDiff }, { transaction: t });

      if (quantity <= 0) {
        await item.destroy({ transaction: t });
      } else {
        await item.update({ quantity }, { transaction: t });
      }

      // Recalculate total
      const allItems = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [{ model: CatalogVariant, as: 'variant' }],
        transaction: t,
      });
      const totalPrice = allItems.reduce((sum, i) => {
        const price = i.variant ? parseFloat(i.variant.productPrice) : 0;
        return sum + price * i.quantity;
      }, 0);
      await cart.update({ totalPrice }, { transaction: t });

      await t.commit();

      const fullCart = await Cart.findByPk(cart.id, {
        include: [{
          model: CartItem, as: 'items',
          include: [
            { model: Catalog, as: 'product' },
            { model: CatalogVariant, as: 'variant', include: [{ model: VariantImage, as: 'productImages' }] },
          ],
        }],
      });

      return res.status(200).json({ success: true, message: 'Keranjang berhasil diperbarui', cart: fullCart });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }),

  // ─── REMOVE CART ITEM ─────────────────────────────────────────────────────────
  removeCartItem: catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { itemId } = req.params;

    const t = await sequelize.transaction();
    try {
      const cart = await Cart.findOne({ where: { userId }, transaction: t });
      if (!cart) { await t.rollback(); return next(new AppError('Keranjang tidak ditemukan', 404)); }

      const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id }, transaction: t });
      if (!item) { await t.rollback(); return next(new AppError('Item tidak ditemukan di keranjang', 404)); }

      // Kembalikan stok
      const variant = await CatalogVariant.findByPk(item.variantId, { transaction: t });
      if (variant) await variant.update({ stock: variant.stock + item.quantity }, { transaction: t });

      await item.destroy({ transaction: t });

      // Recalculate total
      const allItems = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [{ model: CatalogVariant, as: 'variant' }],
        transaction: t,
      });
      const totalPrice = allItems.reduce((sum, i) => {
        const price = i.variant ? parseFloat(i.variant.productPrice) : 0;
        return sum + price * i.quantity;
      }, 0);
      await cart.update({ totalPrice }, { transaction: t });

      await t.commit();

      const fullCart = await Cart.findByPk(cart.id, {
        include: [{
          model: CartItem, as: 'items',
          include: [
            { model: Catalog, as: 'product' },
            { model: CatalogVariant, as: 'variant', include: [{ model: VariantImage, as: 'productImages' }] },
          ],
        }],
      });

      res.status(200).json({ success: true, message: 'Item berhasil dihapus dari keranjang', cart: fullCart });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }),

  // ─── CLEAR CART ───────────────────────────────────────────────────────────────
  clearCart: catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const t = await sequelize.transaction();
    try {
      const cart = await Cart.findOne({
        where: { userId },
        include: [{ model: CartItem, as: 'items' }],
        transaction: t,
      });

      if (!cart) {
        await t.commit();
        return res.status(200).json({ success: true, message: 'Keranjang sudah kosong' });
      }

      // Kembalikan semua stok
      for (const item of cart.items) {
        const variant = await CatalogVariant.findByPk(item.variantId, { transaction: t });
        if (variant) await variant.update({ stock: variant.stock + item.quantity }, { transaction: t });
      }

      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });
      await cart.update({ totalPrice: 0 }, { transaction: t });

      await t.commit();
      res.status(200).json({ success: true, message: 'Keranjang berhasil dikosongkan' });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }),
};

export default KeranjangController;
