import express from "express";
import KeranjangController from "../controllers/keranjangController.js";
import { customerAuth } from "../middleware/customerAuth.js";
import { validate, addToCartSchema, updateCartSchema } from "../utils/ValidationSchemas.js"

const keranjangrouter = express.Router();

// All cart routes require authentication
keranjangrouter.use(customerAuth);

// POST: Add to cart with validation
keranjangrouter.post(
  "/add",
  validate(addToCartSchema),
  KeranjangController.addToCart
);

// GET: Get cart
keranjangrouter.get("/", KeranjangController.getCart);

// PUT: Update cart item with validation
keranjangrouter.put(
  "/update",
  validate(updateCartSchema),
  KeranjangController.updateCartItem
);

// DELETE: Remove specific item (itemId from params only, userId from JWT)
keranjangrouter.delete("/item/:itemId", KeranjangController.removeCartItem);

// DELETE: Clear entire cart
keranjangrouter.delete("/clear", KeranjangController.clearCart);

export default keranjangrouter;