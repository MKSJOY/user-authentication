
import express from "express";
import {
  createBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
  getBuildingSummary,
} from "../controllers/build-site-controller.js";

const router = express.Router();

// ✅ Put /summary above /:id
router.get("/summary", getBuildingSummary);
router.get("/all", getAllBuildings);
router.post("/add", createBuilding);
router.get("/:id", getBuildingById);
router.put("/:id", updateBuilding);
router.delete("/:id", deleteBuilding);

export const buildRoutes = router;
