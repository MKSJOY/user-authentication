import express from "express";
import { createFullBudget, getAllBudget, getBudget, updateBudget, deleteBudget } from "../controllers/budgetController.js";

const router = express.Router();

// Create full budget
router.post("/", createFullBudget);

// Get all budgets
router.get("/", getAllBudget);

// Get budget by ID
router.get("/:id", getBudget);

// Update budget by ID
router.put("/:id", updateBudget);

// Delete budget by ID
router.delete("/:id", deleteBudget);

export { router as budgetRoutes };
