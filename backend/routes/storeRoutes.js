import express from "express";
import {
  createStore,
  getStores,
  assignCashier,
  assignManager,
} from "../controllers/storeController.js";

const router = express.Router();

router.post("/create", createStore);
router.get("/", getStores);
router.put("/assign-cashier", assignCashier);
router.put("/assign-manager", assignManager);

export default router;
