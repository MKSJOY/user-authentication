import express from "express";
import { getCompaniesByUser } from "../controllers/company-userID-controller.js";

const router = express.Router();

router.get("/user/:id", getCompaniesByUser); // Get companies by user ID

export const companyRoutes = router;
