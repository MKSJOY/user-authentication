// routes/stockTransferRoutes.js

import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove
} from "../controllers/stockTransferController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
