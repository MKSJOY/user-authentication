import express from "express";
import { addProjectType, getProjectTypes, getProjectType, updateProjectType, removeProjectType } from "../controllers/project-type-controller.js";

const router = express.Router();

router.post("/add", addProjectType);
router.get("/all", getProjectTypes);
router.get("/get/:id", getProjectType);
router.put("/update/:id", updateProjectType);
router.delete("/delete/:id", removeProjectType);

export const projectTypeRoutes = router;