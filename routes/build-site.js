import express from "express";
import {
  createBuilding,
  getAllBuildings,
  getBuildingByProjectName,
  updateBuilding,
  deleteBuilding,
  getProjectNames,
} from "../controllers/build-site-controller.js";

const router = express.Router();

router.post("/add", createBuilding);
router.get("/all", getAllBuildings);
router.get("/:project_name", getBuildingByProjectName);
router.put("/:project_name", updateBuilding); 
router.delete("/:project_name", deleteBuilding);
router.get("/projects/names", getProjectNames);

export const buildRoutes = router;
