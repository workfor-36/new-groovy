import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import billRoutes from "./routes/billRoutes.js";
import connectDB from './config/db.js';
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import assignRoutes from "./routes/assignRoutes.js"
import storeRoutes from "./routes/storeRoutes.js";
import reportRoutes from './routes/reportRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js'
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
import taxRoutes from './routes/taxRoutes.js'

dotenv.config();
connectDB();
const app = express();

app.use(cors({
  origin: "https://groovyfrontend.onrender.com",  // your React dev server
  credentials: true,                // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/bills", billRoutes);
app.use("/api/products", productRoutes);
app.use("/api/assign", assignRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/attributes", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/tax",taxRoutes);



export default app;
