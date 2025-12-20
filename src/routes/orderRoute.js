import express from "express";
import {
  createOrder,
  verifyOrder,
  cancelOrder,
  getAllOrders,
  getOrderById,
  getUserOrderHistory,
} from "../controllers/orderController.js";

const router = express.Router();

// Public/Guest routes (dengan optional auth check)
router.post("/", createOrder);

// User authenticated routes (harus sebelum routes dinamis)
router.get("/user/history", getUserOrderHistory);

// Admin routes (tambahkan auth admin middleware jika perlu)
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id/verify", verifyOrder);
router.patch("/:id/cancel", cancelOrder);

export default router;
