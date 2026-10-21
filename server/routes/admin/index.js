import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import requireRole from "../../middleware/roleMiddleware.js";
import dashboardRoutes from "./dashboardRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import supplierRoutes from "./supplierRoutes.js";
import customerRoutes from "./customerRoutes.js";
import orderRoutes from "./orderRoutes.js";
import reportRoutes from "./reportRoutes.js";

const router = express.Router();

// Every /api/admin/* route requires a valid JWT AND an admin role (looked up
// from the database by authMiddleware, never taken from the client).
router.use(authMiddleware, requireRole("admin"));

router.use("/dashboard", dashboardRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/categories", categoryRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/customers", customerRoutes);
router.use("/orders", orderRoutes);
router.use("/reports", reportRoutes);

export default router;