import Bill from "../models/billModel.js";
import Store from "../models/storeModel.js";
import mongoose from "mongoose";


// Utility for date ranges
const getDateRange = (daysAgo) => {
  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - daysAgo);
  return { from, to: now };
};

// Helper function to aggregate sales
const aggregateSales = async (filter) => {
  return await Bill.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
        billCount: { $sum: 1 },
gstCollected: { $sum: "$taxAmount" }
      },
    },
  ]);
};

// Manager-level store report
export const getStoreReport = async (req, res) => {
  try {
    const { storeId } = req.params;

    const { from: dailyFrom, to } = getDateRange(1);
    const { from: weeklyFrom } = getDateRange(7);
    const { from: monthlyFrom } = getDateRange(30);

    const [daily, weekly, monthly] = await Promise.all([
      aggregateSales({ store: new mongoose.Types.ObjectId(storeId), createdAt: { $gte: dailyFrom, $lte: to } }),
      aggregateSales({ store: new mongoose.Types.ObjectId(storeId), createdAt: { $gte: weeklyFrom, $lte: to } }),
      aggregateSales({ store: new mongoose.Types.ObjectId(storeId), createdAt: { $gte: monthlyFrom, $lte: to } }),
    ]);

    res.json({
      storeId,
      dailySales: daily[0]?.billCount || 0,
      dailyRevenue: daily[0]?.totalSales || 0,
      weeklySales: weekly[0]?.billCount || 0,
      weeklyRevenue: weekly[0]?.totalSales || 0,
      monthlySales: monthly[0]?.billCount || 0,
      monthlyRevenue: monthly[0]?.totalSales || 0,
      gstCollected: monthly[0]?.gstCollected || 0,
      gstPending: Math.floor((monthly[0]?.gstCollected || 0) * 0.2), // Simulated 20% pending
    });
  } catch (err) {
    console.error("Store report error:", err);
    res.status(500).json({ message: "Failed to fetch report" });
  }
};

// Admin-level all-store report
export const getAllStoreReports = async (req, res) => {
  try {
    const stores = await Store.find();
    console.log("Stores found:", stores.length);

    const reportPromises = stores.map((store) =>
  getStoreSummary(store._id).then((report) => ({
    ...report,
    storeId: store.storeId, // custom store ID (e.g. "SR1")
    storeName: store.storeName,
    location: store.location,
  }))
);

    const reports = await Promise.all(reportPromises);
    res.json(reports);
  } catch (err) {
    console.error("All store report error:", err);
    res.status(500).json({ message: "Failed to fetch all reports" });
  }
};


const getStoreSummary = async (storeId) => {
  const validObjectId = storeId;

  console.log("Processing store ID:", storeId);

  if (!validObjectId) throw new Error(`Invalid ObjectId for store: ${storeId}`);

  const { from: dailyFrom, to } = getDateRange(1);
  const { from: weeklyFrom } = getDateRange(7);
  const { from: monthlyFrom } = getDateRange(30);

  const [daily, weekly, monthly] = await Promise.all([
    aggregateSales({ store: validObjectId, createdAt: { $gte: dailyFrom, $lte: to } }),
    aggregateSales({ store: validObjectId, createdAt: { $gte: weeklyFrom, $lte: to } }),
    aggregateSales({ store: validObjectId, createdAt: { $gte: monthlyFrom, $lte: to } }),
  ]);

  return {
    dailySales: daily[0]?.billCount || 0,
    dailyRevenue: daily[0]?.totalSales || 0,
    weeklySales: weekly[0]?.billCount || 0,
    weeklyRevenue: weekly[0]?.totalSales || 0,
    monthlySales: monthly[0]?.billCount || 0,
    monthlyRevenue: monthly[0]?.totalSales || 0,
    gstCollected: monthly[0]?.gstCollected || 0,
    gstPending: Math.floor((monthly[0]?.gstCollected || 0) * 0.2),
  };
};
