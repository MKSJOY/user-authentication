import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createNewWorkHead, getWorkHeads, getWorkHead, updateWorkHeadData, deleteWorkHeadData } from "../controllers/workHeadController.js";

const router = express.Router();

// Route to create a new work head
router.post("/", authMiddleware, createNewWorkHead);

// Route to get all work heads
router.get("/", authMiddleware, getWorkHeads);

// Route to get a work head by ID
router.get("/:id", authMiddleware, getWorkHead);

// Route to update a work head by ID
router.put("/:id", authMiddleware, updateWorkHeadData);

// Route to delete a work head by ID
router.delete("/:id", authMiddleware, deleteWorkHeadData);

export { router };
