import express from "express";
import { fixClientSerial } from "../controllers/fix-serial-client.js";

const router = express.Router();

// POST /api/clients/fix-serial
router.post("/fix-serial", fixClientSerial);

export const fixSerial = router;
