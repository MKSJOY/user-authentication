import express from "express";
import {
  addProperty,
  getAllProperty,
  getPropertiesById,
  updateProperties,
  deleteProperties,
} from "../controllers/property-controller.js";

const router = express.Router();

// Add Property
router.post("/properties/add", addProperty);

// Get All Properties
router.get("/properties/all", getAllProperty);

// Get Property by ID
router.get("/properties/:id", getPropertiesById);

// Update Property
router.put("/properties/update/:id", updateProperties);

// Delete Property
router.delete("/properties/delete/:id", deleteProperties);

export const propertyRoutes = router;
