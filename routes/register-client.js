import express from "express";
import { createClient, getAllClients, getClientById, deleteClient, updateClient } from "../controllers/register-client-controller.js";

const router = express.Router();

router.post("/add", createClient);
router.get("/all", getAllClients);
router.get("/:id", getClientById);
router.put("/update/:id", updateClient);
router.delete("/delete/:id", deleteClient);

export const clientRoutes = router;
