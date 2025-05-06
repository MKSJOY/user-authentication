import express from 'express';
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from "../controllers/buildingProductController.js";

const router = express.Router();

// Create a new building product
router.post("/", createProduct);

// Get all building products
router.get("/", getAllProducts);

// Get a building product by ID
router.get("/:id", getProductById);

// Update a building product by ID
router.put("/:id", updateProduct);

// Delete a building product by ID
router.delete("/:id", deleteProduct);

export default router;
