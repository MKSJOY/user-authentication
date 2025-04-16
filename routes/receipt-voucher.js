import express from "express";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import {
  createReceiptVoucher,
  getAllReceiptVouchers,
  getReceiptVoucherById,
  updateReceiptVoucher,
  deleteReceiptVoucher,
} from "../controllers/receiptVoucherController.js";

const router = express.Router();

router.post("/",uploadMiddleware.single("upload_file_path"), createReceiptVoucher);
router.get("/", getAllReceiptVouchers);
router.get("/:id", getReceiptVoucherById);
router.put("/:id", uploadMiddleware.single("upload_file_path"), updateReceiptVoucher);
router.delete("/:id", deleteReceiptVoucher);

export { router as receiptVoucherRoutes };
