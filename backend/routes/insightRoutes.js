import express from "express";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/insights
 * @desc    Generate smart financial insights
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year required" });
    }

    const insights = [];

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    const prevStart = new Date(year, month - 2, 1);
    const prevEnd = new Date(year, month - 1, 1);

    // 1️⃣ Category-wise spending (current month)
    const categorySpend = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // 2️⃣ Total spending
    const totalSpent = categorySpend.reduce(
      (sum, c) => sum + c.total,
      0
    );

    // 🔍 Insight: Highest spending category
    if (categorySpend.length > 0) {
      const top = categorySpend.reduce((a, b) =>
        b.total > a.total ? b : a
      );

      const percentage = ((top.total / totalSpent) * 100).toFixed(1);

      insights.push(
        `Your highest spending category is ${top._id}, accounting for ${percentage}% of your total expenses.`
      );
    }

    // 3️⃣ Budget overspending insights
    const budgets = await Budget.find({
      userId: req.user._id,
      month,
      year,
    });

    for (let budget of budgets) {
      const spent =
        categorySpend.find((c) => c._id === budget.category)?.total || 0;

      if (spent > budget.monthlyLimit) {
        const excess = spent - budget.monthlyLimit;
        insights.push(
          `You overspent on ${budget.category} by ₹${excess}.`
        );
      } else if (spent > budget.monthlyLimit * 0.8) {
        insights.push(
          `You are close to exceeding your ${budget.category} budget.`
        );
      }
    }

    // 4️⃣ Month-over-month comparison
    const currentMonthTotal = await Expense.aggregate([
      { $match: { userId: req.user._id, date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const previousMonthTotal = await Expense.aggregate([
      { $match: { userId: req.user._id, date: { $gte: prevStart, $lt: prevEnd } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const current = currentMonthTotal[0]?.total || 0;
    const previous = previousMonthTotal[0]?.total || 0;

    if (previous > 0) {
      const diff = current - previous;

      if (diff > 0) {
        insights.push(
          `Your spending increased by ₹${diff} compared to last month.`
        );
      } else if (diff < 0) {
        insights.push(
          `Good job! You spent ₹${Math.abs(diff)} less than last month.`
        );
      }
    }

    // 5️⃣ Smart savings suggestion (rule-based)
    if (totalSpent > 0) {
      const foodSpend =
        categorySpend.find((c) => c._id === "Food")?.total || 0;

      if (foodSpend / totalSpent > 0.4) {
        insights.push(
          "You are spending a large portion on Food. Reducing online food orders could help you save more."
        );
      }
    }

    res.json({
      month,
      year,
      insights,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
