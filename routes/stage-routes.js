import express from "express";
import { addStage, getStagesByBuilding, updateStage, deleteStage } from "../controllers/stage-controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addStage); // Add a new stage
router.get("/:building_id", authMiddleware, getStagesByBuilding); // Get all stages for a building
router.put("/:stage_id", authMiddleware, updateStage); // Update a stage
router.delete("/:stage_id", authMiddleware, deleteStage); // Delete a stage

export const stageRoutes = router;