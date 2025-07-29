import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import billRoutes from "./routes/billRoutes.js";
import connectDB from './config/db.js';
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import assignRoutes from "./routes/productRoutes.js"
import storeRoutes from "./routes/storeRoutes.js";
import reportRoutes from './routes/reportRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js'
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";



dotenv.config();
connectDB();
const app = express();

// app.use(cors({
//   origin: 'http://localhost:5173', // frontend origin
//   credentials: true,              // allow cookies from frontend
// }));

app.use("/api/bills", billRoutes);
app.use("/api/products", productRoutes);
app.use("/api/assign", assignRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/auth", authRoutes);


app.use(express.json());
app.use(cookieParser());

export default app;
