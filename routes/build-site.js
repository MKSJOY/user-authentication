import express from "express";
import {
  createBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
} from "../controllers/build-site-controller.js";

const router = express.Router();

router.post("/add", createBuilding);
router.get("/all", getAllBuildings);
router.get("/:id", getBuildingById);
router.put("/:id", updateBuilding); 
router.delete("/:id", deleteBuilding);
//router.get("/projects/names", getProjectNames);

export const buildRoutes = router;
