import express from "express";
import { query } from "../config/database.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new project type
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { name, code } = req.body;

    // Check if the type code already exists
    const existingType = await query("SELECT * FROM project_types WHERE code = ?", [code]);
    if (existingType.length > 0) {
      return res.status(400).json({ message: "Type code already exists" });
    }

    // Insert the new type into the database
    const result = await query("INSERT INTO project_types (name, code) VALUES (?, ?)", [name, code]);

    res.status(201).json({
      message: "Project Type added successfully",
      type: {
        id: result.insertId,
        name,
        code,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all project types
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const types = await query("SELECT * FROM project_types");

    res.status(200).json({ types });
  } catch (error) {
    next(error);
  }
});

export const projectTypeRoutes = router;
