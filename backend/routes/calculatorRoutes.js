import express from "express";
import { calculateEcoScore } from "../controllers/calculatorController.js";

const router = express.Router();

// calculator route
router.post("/calculate", calculateEcoScore);

export default router;