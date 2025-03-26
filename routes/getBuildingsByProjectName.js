import express from "express";
import { getBuildingsByProject } from "../controllers/getBuildings-projectName-controller.js"; // Import your controller

const router = express.Router();

router.get("/:project_name", getBuildingsByProject); // Get buildings by project name

export const getBuildingRoutes = router;
