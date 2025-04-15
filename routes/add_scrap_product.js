import express from "express";
import {
    createScrapProduct,
    getScrapProducts,
    removeScrapProduct,
    editScrapProduct,
    getSingleScrapProduct
} from "../controllers/add_scrap_product.js";

const router = express.Router();

router.post("/add", createScrapProduct);         // Create
router.get("/all", getScrapProducts);            // Get all
router.get("/:id", getSingleScrapProduct);    // 🔍 Get by ID
router.put("/:id", editScrapProduct);         // Update
router.delete("/:id", removeScrapProduct);    // Delete

export const addScrapProduct = router;
