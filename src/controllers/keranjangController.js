import mongoose from "mongoose";
import Cart from "../models/keranjangModel.js";
import Catalog from "../models/catalogModel.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../middleware/errorHandler.js";

const KeranjangController = {
  // ADD TO CART with Stock Management
  addToCart: catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // ✅ From JWT token, NOT from request body/params!

    const qtyToAdd = quantity || 1;

    // Start database transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find product with session
      const product = await Catalog.findById(productId).session(session);

      if (!product) {
        await session.abortTransaction();
        return next(new AppError('Produk tidak ditemukan', 404));
      }

      if (!product.isActive) {
        await session.abortTransaction();
        return next(new AppError('Produk tidak tersedia', 400));
      }

      // Check stock availability
      if (product.stock < qtyToAdd) {
        await session.abortTransaction();
        return next(
          new AppError(
            `Stok tidak mencukupi. Stok tersedia: ${product.stock}`,
            400
          )
        );
      }

      // Validate price
      if (typeof product.productPrice !== "number" || product.productPrice <= 0) {
        await session.abortTransaction();
        return next(new AppError('Data produk tidak valid', 500));
      }

      // Find active cart for this user
      let cart = await Cart.findOne({
        userId,
        status: "active",
      }).session(session);

      // Create new cart if doesn't exist
      if (!cart) {
        cart = new Cart({
          userId,
          items: [],
          status: "active",
        });
      }

      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        const existingItem = cart.items[existingItemIndex];
        const newQuantity = existingItem.quantity + qtyToAdd;

        // Check total stock needed
        if (product.stock < newQuantity) {
          await session.abortTransaction();
          return next(
            new AppError(
              `Stok tidak mencukupi. Anda sudah memiliki ${existingItem.quantity} item di keranjang. Stok tersedia: ${product.stock}`,
              400
            )
          );
        }

        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({ product: productId, quantity: qtyToAdd });
      }

      // Update product stock
      product.stock -= qtyToAdd;
      await product.save({ session });

      // Calculate total price
      await cart.populate("items.product");
      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + item.product.productPrice * item.quantity;
      }, 0);

      await cart.save({ session });

      // Commit transaction
      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: "Produk berhasil ditambahkan ke keranjang",
        cart,
      });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }),

  // GET CART - Only for authenticated user
  getCart: catchAsync(async (req, res, next) => {
    const userId = req.user._id; // ✅ From JWT token

    const cart = await Cart.findOne({ userId, status: "active" }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalPrice: 0 },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  }),

  // UPDATE CART ITEM with Stock Management
  updateCartItem: catchAsync(async (req, res, next) => {
    const userId = req.user._id; // ✅ From JWT token
    const { itemId, quantity } = req.body;

    if (!itemId) {
      return next(new AppError('Item ID harus disertakan', 400));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const cart = await Cart.findOne({ userId, status: "active" })
        .populate('items.product')
        .session(session);

      if (!cart) {
        await session.abortTransaction();
        return next(new AppError('Keranjang tidak ditemukan', 404));
      }

      const item = cart.items.id(itemId);
      if (!item) {
        await session.abortTransaction();
        return next(new AppError('Item tidak ditemukan di keranjang', 404));
      }

      const product = await Catalog.findById(item.product._id).session(session);
      if (!product) {
        await session.abortTransaction();
        return next(new AppError('Produk tidak ditemukan', 404));
      }

      const oldQuantity = item.quantity;
      const quantityDiff = quantity - oldQuantity;

      // If increasing quantity, check stock
      if (quantityDiff > 0) {
        if (product.stock < quantityDiff) {
          await session.abortTransaction();
          return next(
            new AppError(
              `Stok tidak mencukupi. Stok tersedia: ${product.stock}`,
              400
            )
          );
        }
        product.stock -= quantityDiff;
      } else {
        // Return stock if decreasing
        product.stock += Math.abs(quantityDiff);
      }

      await product.save({ session });

      // Update or remove item
      if (quantity <= 0) {
        cart.items.pull(item);
      } else {
        item.quantity = quantity;
      }

      // Recalculate total
      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (item.product?.productPrice || 0) * item.quantity;
      }, 0);

      await cart.save({ session });
      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        message: "Keranjang berhasil diperbarui",
        cart,
      });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }),

  // REMOVE CART ITEM with Stock Return
  removeCartItem: catchAsync(async (req, res, next) => {
    const userId = req.user._id; // ✅ From JWT token, NOT from params!
    const { itemId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const cart = await Cart.findOne({ userId, status: "active" })
        .populate('items.product')
        .session(session);

      if (!cart) {
        await session.abortTransaction();
        return next(new AppError('Keranjang tidak ditemukan', 404));
      }

      const itemToRemove = cart.items.id(itemId);

      if (!itemToRemove) {
        await session.abortTransaction();
        return next(new AppError('Item tidak ditemukan di keranjang', 404));
      }

      // Return stock to product
      const product = await Catalog.findById(itemToRemove.product._id).session(session);
      if (product) {
        product.stock += itemToRemove.quantity;
        await product.save({ session });
      }

      // Remove item
      cart.items.pull(itemToRemove);

      // Recalculate total
      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + item.product.productPrice * item.quantity;
      }, 0);

      await cart.save({ session });
      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: "Item berhasil dihapus dari keranjang",
        cart,
      });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }),

  // CLEAR CART (optional)
  clearCart: catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const cart = await Cart.findOne({ userId, status: "active" })
        .populate('items.product')
        .session(session);

      if (!cart) {
        await session.abortTransaction();
        return res.status(200).json({
          success: true,
          message: "Keranjang sudah kosong",
        });
      }

      // Return all stock
      for (const item of cart.items) {
        const product = await Catalog.findById(item.product._id).session(session);
        if (product) {
          product.stock += item.quantity;
          await product.save({ session });
        }
      }

      cart.items = [];
      cart.totalPrice = 0;
      await cart.save({ session });

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: "Keranjang berhasil dikosongkan",
      });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }),
};

export default KeranjangController;