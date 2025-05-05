import express from "express";
import {
  addPurchaseReturn,
  getPurchaseReturns,
  getPurchaseReturn,
  editPurchaseReturn,
  removePurchaseReturn,
} from "../controllers/purchaseReturnController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addPurchaseReturn);
router.get("/", getPurchaseReturns);
router.get("/:id", getPurchaseReturn);
router.put("/:id", editPurchaseReturn);
router.delete("/:id", removePurchaseReturn);

export default router;
