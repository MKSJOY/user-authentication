import express from "express";
import { addProjectType, getProjectTypes, getProjectType, removeProjectType } from "../controllers/projectType-controller.js";

const router = express.Router();

router.post("/add", addProjectType);
router.get("/all", getProjectTypes);
router.get("/get/:id", getProjectType);
router.delete("/delete/:id", removeProjectType);

export const projectTypeRoutes = router;
