import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createScheduleWithItems,
  getAllScheduleData,
  getScheduleDetails,
  updateScheduleDetails,
  deleteScheduleById,
} from "../controllers/scheduleController.js";

const router = express.Router();

router.post("/", authMiddleware, createScheduleWithItems);
router.get("/", authMiddleware, getAllScheduleData);
router.get("/:id", authMiddleware, getScheduleDetails);
router.put("/:id", authMiddleware, updateScheduleDetails);
router.delete("/:id", authMiddleware, deleteScheduleById);

export { router as scheduleRoutes };