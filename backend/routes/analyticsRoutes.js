import express from "express";
import Expense from "../models/Expense.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/analytics/monthly-summary
 * @desc    Monthly expense summary
 * @access  Private
 */
router.get("/monthly-summary", protect, async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const summary = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
          totalExpenses: { $sum: 1 },
          avgExpense: { $avg: "$amount" },
        },
      },
    ]);

    res.json(
      summary[0] || {
        totalSpent: 0,
        totalExpenses: 0,
        avgExpense: 0,
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/analytics/category-breakdown
 * @desc    Category-wise expense breakdown
 * @access  Private
 */
router.get("/category-breakdown", protect, async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const breakdown = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
    ]);

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/analytics/top-category
 * @desc    Highest spending category
 * @access  Private
 */
router.get("/top-category", protect, async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const topCategory = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 1 },
    ]);

    res.json(topCategory[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/analytics/month-comparison
 * @desc    Compare current month with previous month
 * @access  Private
 */
router.get("/month-comparison", protect, async (req, res) => {
  try {
    const { month, year } = req.query;

    const currentStart = new Date(year, month - 1, 1);
    const currentEnd = new Date(year, month, 1);

    const prevStart = new Date(year, month - 2, 1);
    const prevEnd = new Date(year, month - 1, 1);

    const current = await Expense.aggregate([
      { $match: { userId: req.user._id, date: { $gte: currentStart, $lt: currentEnd } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const previous = await Expense.aggregate([
      { $match: { userId: req.user._id, date: { $gte: prevStart, $lt: prevEnd } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const currentTotal = current[0]?.total || 0;
    const previousTotal = previous[0]?.total || 0;

    const percentageChange =
      previousTotal === 0
        ? 100
        : ((currentTotal - previousTotal) / previousTotal) * 100;

    res.json({
      currentMonth: currentTotal,
      previousMonth: previousTotal,
      percentageChange: percentageChange.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
