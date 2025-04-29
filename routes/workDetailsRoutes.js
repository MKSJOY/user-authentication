import express from "express";
import { createNewWorkDetail, getWorkDetails, getWorkDetail, updateWorkDetailById, deleteWorkDetailById } from "../controllers/workDetailsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Work Details CRUD
router.post("/", authMiddleware, createNewWorkDetail);
router.get("/", authMiddleware, getWorkDetails);
router.get("/:id", authMiddleware, getWorkDetail);
router.put("/:id", authMiddleware, updateWorkDetailById);
router.delete("/:id", authMiddleware, deleteWorkDetailById);

export { router as workDetailsRoutes };
