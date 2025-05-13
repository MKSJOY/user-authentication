import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/stockConsumptionController.js";

const router = express.Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, getAll);
router.get("/:id", authMiddleware, getById);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);

export default router;
