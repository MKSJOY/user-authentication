import express from "express";
import {
  createLandSaleOrderController,
  getAllLandSaleOrdersController,
  getLandSaleOrderByIdController,
  updateLandSaleOrderController,
  deleteLandSaleOrderController
} from "../controllers/create_sale_order_land.js";

const router = express.Router();

router.post("/create", createLandSaleOrderController);
router.get("/all", getAllLandSaleOrdersController);
router.get("/:id", getLandSaleOrderByIdController);
router.put("/:id", updateLandSaleOrderController);
router.delete("/:id", deleteLandSaleOrderController);

export const saleLandRoutes = router;
