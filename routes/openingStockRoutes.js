import express from "express";
import {
  createOpeningStock,
  getOpeningStocks,
  getOpeningStockById,
  updateOpeningStock,
  deleteOpeningStock,
} from "../controllers/openingStockController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOpeningStock);
router.get("/", getOpeningStocks);
router.get("/:id", getOpeningStockById);
router.put("/:id", updateOpeningStock);
router.delete("/:id", deleteOpeningStock);

export default router;
