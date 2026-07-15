// portofolioRoute.js
import express from "express";
import portofolioController from "../controllers/portofolioController.js";
import upload from "../middleware/uploadMiddleware.js"; // Import local upload middleware

const PortofolioRouter = express.Router();

// =====================================
// ========== ROUTE PROTOFOLIO =========
// =====================================

// METHOD POST : upload portofolio
PortofolioRouter.post(
  "/",
  upload.single("gambar"),
  portofolioController.createPortofolio,
);

// METHOD GET : mengambil semua data portofolio
PortofolioRouter.get("/", portofolioController.getAllPortofolio);

// METHODT GET BY ID : mengambil data portofolio bedasarkan id
PortofolioRouter.get("/:id", portofolioController.getPortofolioById);

// METOD PATCH : mengedit data portofolio
PortofolioRouter.patch(
  "/:id",
  upload.single("gambar"),
  portofolioController.updatePortofolio,
);

// METHOD DELETE : menghapus data portofolio
PortofolioRouter.delete("/:id", portofolioController.deletePortofolio);

export default PortofolioRouter;
