// routes/catalogRoutes.js
import express from "express";
import catalogController from "../controllers/catalogController.js";
import upload from "../middleware/uploadMiddleware.js";

const catalogRoutes = express.Router();

// ========================================
// ROUTES
// ========================================

// GET all catalogs (with optional filters)
catalogRoutes.get("/", catalogController.getAllCatalog);
// GET search catalogs
catalogRoutes.get("/search", catalogController.searchCatalog);
// GET catalog by ID`
catalogRoutes.get("/:id", catalogController.getCatalogById);

catalogRoutes.post(
  "/",
  upload.array("images", 10),
  catalogController.createCatalog,
);

catalogRoutes.patch(
  "/:id",
  upload.array("images", 10),
  catalogController.updateCatalog,
);

// DELETE catalog
catalogRoutes.delete("/:id", catalogController.deleteCatalog);

// ========================================
// VARIANT ROUTES
// ========================================

// Add variant to catalog
catalogRoutes.post(
  "/:id/variants",
  upload.array("images", 10),
  catalogController.addVariant,
);

// Get specific variant
catalogRoutes.get("/:id/variants/:variantId", catalogController.getVariantById);

// Update variant
catalogRoutes.patch(
  "/:id/variants/:variantId",
  upload.array("images", 10),
  catalogController.updateVariant,
);

// Delete variant
catalogRoutes.delete(
  "/:id/variants/:variantId",
  catalogController.deleteVariant,
);

// ========================================
// BONUS ROUTES
// ========================================

// Get available colors for a product
catalogRoutes.get("/:id/colors", catalogController.getProductColors);

// Check stock availability (all variants or specific variant)
catalogRoutes.get("/:id/stock", catalogController.checkStock);
catalogRoutes.get("/:id/stock/:variantId", catalogController.checkStock);

export default catalogRoutes;
