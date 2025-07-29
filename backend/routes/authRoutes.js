import express from "express";
import { loginManager, loginCashier } from "../controllers/authController.js";

const router = express.Router();

router.post("/manager/login", loginManager);
router.post("/cashier/login", loginCashier);

export default router;
