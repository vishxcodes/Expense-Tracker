import express from "express";
import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/budgets
 * @desc    Create or update a budget
 */
router.post("/", protect, async (req, res) => {
  try {
    const { category, monthlyLimit, month, year } = req.body;

    let budget = await Budget.findOne({
      userId: req.user._id,
      category,
      month,
      year,
    });

    if (budget) {
      budget.monthlyLimit = monthlyLimit;
      await budget.save();
    } else {
      budget = await Budget.create({
        userId: req.user._id,
        category,
        monthlyLimit,
        month,
        year,
      });
    }

    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   GET /api/budgets
 * @desc    Get budgets with usage & alerts
 */
router.get("/", protect, async (req, res) => {
  try {
    const { month, year } = req.query;

    const budgets = await Budget.find({
      userId: req.user._id,
      month,
      year,
    });

    const result = [];

    for (let budget of budgets) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      const expenses = await Expense.aggregate([
        {
          $match: {
            userId: req.user._id,
            category: budget.category,
            date: { $gte: startDate, $lt: endDate },
          },
        },
        {
          $group: {
            _id: null,
            spent: { $sum: "$amount" },
          },
        },
      ]);

      const spent = expenses[0]?.spent || 0;
      const percentageUsed = (spent / budget.monthlyLimit) * 100;

      result.push({
        category: budget.category,
        limit: budget.monthlyLimit,
        spent,
        percentageUsed: percentageUsed.toFixed(2),
        alert:
          percentageUsed >= 100
            ? "Budget exceeded"
            : percentageUsed >= 80
            ? "Near budget limit"
            : "Within budget",
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/budgets/:id
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    if (budget.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await budget.deleteOne();
    res.json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
