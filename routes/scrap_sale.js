import express from "express";
import {
    createScrapSale,
    getScrapSales,
    getSingleScrapSale,
    editScrapSale,
    removeScrapSale
} from "../controllers/scrap_sale.js";

const router = express.Router();

router.post("/create", createScrapSale);
router.get("/all", getScrapSales);
router.get("/:id", getSingleScrapSale);
router.put("/:id", editScrapSale);
router.delete("/:id", removeScrapSale);

export const scrapSale = router;
