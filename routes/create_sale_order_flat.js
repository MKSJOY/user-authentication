import express from "express";
import {
  createSaleOrderController,
  getAllSaleOrdersController,
  getSaleOrderByIdController,
  updateSaleOrderController,
  deleteSaleOrderController,
} from "../controllers/create_sale_order_flat.js";

const router = express.Router();

// Route for creating a sale order, including down payments and installments
router.post("/create", createSaleOrderController); // Create Sale Order with Down Payments and Installments

// Route to get all sale orders
router.get("/all", getAllSaleOrdersController); // Get All Sale Orders

// Route to get a specific sale order by ID
router.get("/:id", getSaleOrderByIdController); // Get Sale Order by ID

// Route to update a sale order
router.put("/:id", updateSaleOrderController); // Update Sale Order

// Route to delete a sale order
router.delete("/:id", deleteSaleOrderController); // Delete Sale Order

export const saleFlatRoutes = router;
