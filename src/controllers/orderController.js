// controllers/orderController.js
import Order, { OrderItem } from '../models/orderModel.js';
import Catalog, { CatalogVariant, VariantImage } from '../models/catalogModel.js';
import UserCustomer from '../models/userCustomerModel.js';
import { Op } from 'sequelize';
import sequelize from '../config/sequelize.js';

// ─── CREATE ORDER ─────────────────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    let { customerName, customerPhone, items } = req.body;
    let userId = null;
    let orderType = 'guest';

    if (req.currentUser) {
      userId = req.currentUser.id;
      orderType = 'registered';
      customerName  = customerName  || req.currentUser.username;
      customerPhone = customerPhone || req.currentUser.nomorhp;
    }

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Data pelanggan dan produk wajib diisi.' });
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      if (!item.productId || !item.variantId || !item.selectedColor || !item.selectedSize) {
        return res.status(400).json({
          success: false,
          message: 'productId, variantId, selectedColor, dan selectedSize wajib diisi untuk setiap item.',
        });
      }

      const product = await Catalog.findByPk(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Produk dengan ID ${item.productId} tidak ditemukan.` });
      if (!product.isActive) return res.status(400).json({ success: false, message: `Produk ${product.productName} tidak tersedia.` });

      const variant = await CatalogVariant.findOne({
        where: { id: item.variantId, catalogId: item.productId },
        include: [{ model: VariantImage, as: 'productImages' }],
      });
      if (!variant) return res.status(404).json({ success: false, message: `Variant dengan ID ${item.variantId} tidak ditemukan.` });

      if (variant.color !== item.selectedColor) {
        return res.status(400).json({ success: false, message: `Warna "${item.selectedColor}" tidak tersedia untuk variant ini.` });
      }
      if (!variant.sizes.includes(item.selectedSize)) {
        return res.status(400).json({ success: false, message: `Ukuran "${item.selectedSize}" tidak tersedia untuk variant ini.` });
      }
      if (variant.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Stok ${product.productName} tidak mencukupi. Stok tersedia: ${variant.stock}` });
      }

      const primaryImage = variant.productImages.find(img => img.isPrimary) || variant.productImages[0];
      const subtotal = parseFloat(variant.productPrice) * item.quantity;
      totalAmount += subtotal;

      processedItems.push({
        productId:            product.id,
        productName:          product.productName,
        productPrice:         parseFloat(variant.productPrice),
        productImageUrl:      primaryImage?.url      || null,
        productImagePublicId: primaryImage?.publicId || null,
        selectedColor:        item.selectedColor,
        selectedSize:         item.selectedSize,
        quantity:             item.quantity,
        subtotal,
      });
    }

    const newOrder = await Order.create({
      userId,
      orderType,
      customerName,
      customerPhone,
      totalAmount,
      status: 'pending',
    });

    await OrderItem.bulkCreate(processedItems.map(item => ({ ...item, orderId: newOrder.id })));

    // Return dengan relasi lengkap
    const result = await Order.findByPk(newOrder.id, {
      include: [
        { model: OrderItem, as: 'items' },
        { model: UserCustomer, as: 'user', attributes: ['username', 'nomorhp'], required: false },
      ],
    });

    res.status(201).json({ success: true, message: 'Pesanan berhasil dibuat.', data: result });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat pesanan.', error: error.message });
  }
};

// ─── VERIFY ORDER ─────────────────────────────────────────────────────────────
export const verifyOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }],
      transaction: t,
    });

    if (!order) { await t.rollback(); return res.status(404).json({ success: false, message: 'Order tidak ditemukan.' }); }
    if (order.status !== 'pending') { await t.rollback(); return res.status(400).json({ success: false, message: `Order sudah dalam status ${order.status}.` }); }

    // Kurangi stok untuk setiap item
    for (const item of order.items) {
      const variant = await CatalogVariant.findOne({
        where: {
          catalogId:    item.productId,
          color:        item.selectedColor,
          productPrice: item.productPrice,
        },
        transaction: t,
      });

      if (!variant) { await t.rollback(); return res.status(404).json({ success: false, message: `Variant untuk ${item.productName} tidak ditemukan.` }); }
      if (variant.stock < item.quantity) { await t.rollback(); return res.status(400).json({ success: false, message: `Stok ${item.productName} tidak mencukupi. Tersisa: ${variant.stock}` }); }

      await variant.update({ stock: variant.stock - item.quantity }, { transaction: t });
    }

    await order.update({ status: 'verified', verifiedAt: new Date() }, { transaction: t });
    await t.commit();

    res.json({ success: true, message: 'Order berhasil diverifikasi dan stok telah dikurangi.', data: order });
  } catch (error) {
    await t.rollback();
    console.error('Error verifying order:', error);
    res.status(500).json({ success: false, message: 'Gagal memverifikasi order.', error: error.message });
  }
};

// ─── CANCEL ORDER ─────────────────────────────────────────────────────────────
export const cancelOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }],
      transaction: t,
    });

    if (!order) { await t.rollback(); return res.status(404).json({ success: false, message: 'Order tidak ditemukan.' }); }
    if (order.status === 'cancelled') { await t.rollback(); return res.status(400).json({ success: false, message: 'Order sudah dibatalkan.' }); }

    const wasVerified = order.status === 'verified';

    if (wasVerified) {
      for (const item of order.items) {
        const variant = await CatalogVariant.findOne({
          where: { catalogId: item.productId, color: item.selectedColor, productPrice: item.productPrice },
          transaction: t,
        });
        if (variant) await variant.update({ stock: variant.stock + item.quantity }, { transaction: t });
      }
    }

    await order.update({ status: 'cancelled', cancelledAt: new Date() }, { transaction: t });
    await t.commit();

    res.json({
      success: true,
      message: wasVerified ? 'Order dibatalkan dan stok telah dikembalikan.' : 'Order dibatalkan.',
      data: order,
    });
  } catch (error) {
    await t.rollback();
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: 'Gagal membatalkan order.', error: error.message });
  }
};

// ─── GET ALL ORDERS ───────────────────────────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const { status, orderType, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (orderType) where.orderType = orderType;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: OrderItem, as: 'items' },
        { model: UserCustomer, as: 'user', attributes: ['username', 'nomorhp'], required: false },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      distinct: true,
      subQuery: false, // Prevents slow nested subqueries in MySQL
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: Number(page), pages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data order.', error: error.message });
  }
};

// ─── GET ORDER BY ID ──────────────────────────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, as: 'items' },
        { model: UserCustomer, as: 'user', attributes: ['username', 'nomorhp'], required: false },
      ],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order tidak ditemukan.' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data order.', error: error.message });
  }
};

// ─── GET USER ORDER HISTORY ───────────────────────────────────────────────────
export const getUserOrderHistory = async (req, res) => {
  try {
    if (!req.currentUser) return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });

    const { status, page = 1, limit = 10 } = req.query;
    const where = { userId: req.currentUser.id };
    if (status) where.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: Number(page), pages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat pesanan.', error: error.message });
  }
};

// ─── COMPLETE ORDER ───────────────────────────────────────────────────────────
export const completeOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order tidak ditemukan.' });
    if (order.status !== 'verified') {
      return res.status(400).json({
        success: false,
        message: `Order dengan status ${order.status} tidak dapat diselesaikan. Hanya status 'verified' yang dapat diselesaikan.`,
      });
    }

    await order.update({ status: 'completed', completedAt: new Date() });
    res.json({ success: true, message: 'Order berhasil diselesaikan.', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menyelesaikan order.', error: error.message });
  }
};

// ─── DELETE ORDER ─────────────────────────────────────────────────────────────
export const deleteOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }],
      transaction: t,
    });

    if (!order) { await t.rollback(); return res.status(404).json({ success: false, message: 'Order tidak ditemukan.' }); }

    const needsStockReturn = order.status === 'verified' || order.status === 'completed';

    if (needsStockReturn) {
      for (const item of order.items) {
        const variant = await CatalogVariant.findOne({
          where: { catalogId: item.productId, color: item.selectedColor, productPrice: item.productPrice },
          transaction: t,
        });
        if (variant) await variant.update({ stock: variant.stock + item.quantity }, { transaction: t });
      }
    }

    await order.destroy({ transaction: t });
    await t.commit();

    res.json({
      success: true,
      message: needsStockReturn ? 'Order berhasil dihapus dan stok telah dikembalikan.' : 'Order berhasil dihapus.',
    });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus order.', error: error.message });
  }
};
