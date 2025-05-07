import express from "express";
import {
  createConstructionPayment,
  getConstructionPayments,
  getConstructionPaymentById,
  updateConstructionPayment,
  deleteConstructionPayment
} from "../controllers/constructionPaymentController.js";

const router = express.Router();

router.post("/", createConstructionPayment);
router.get("/", getConstructionPayments);
router.get("/:id", getConstructionPaymentById);
router.put("/:id", updateConstructionPayment);
router.delete("/:id", deleteConstructionPayment);

export default router;
