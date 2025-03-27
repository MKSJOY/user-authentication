import express from "express";
import { addPlot, getPlots, getPlot, editPlot, removePlot } from "../controllers/plot-controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addPlot);
router.get("/all", authMiddleware, getPlots);
router.get("/get/:id", authMiddleware, getPlot);
router.put("/update/:id", authMiddleware, editPlot);
router.delete("/delete/:id", authMiddleware, removePlot);

export const plotRoutes = router;