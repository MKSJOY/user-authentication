import express from "express";
import { createClient, getAllClients, getClientById, deleteClient, updateClient, getAllProjectsAndBuildingsByClient, getProjectsByClient, getBuildingsByClient } from "../controllers/register-client-controller.js";

const router = express.Router();

router.post("/add", createClient);
router.get("/all", getAllClients);
router.get("/:id", getClientById);
router.put("/update/:id", updateClient);
router.delete("/delete/:id", deleteClient);
router.get("/:id/projects-and-buildings", getAllProjectsAndBuildingsByClient);
router.get("/:id/projects", getProjectsByClient);
router.get("/:id/buildings", getBuildingsByClient);

export const clientRoutes = router;
