import { useEffect, useState } from "react";
import {
  getMonthlySummary,
  getCategoryBreakdown,
  getMonthComparison,
} from "../../api/analytics.api";

import StatCard from "../../components/cards/StatCard";
import CategoryPie from "../../components/charts/CategoryPie";
import MonthBar from "../../components/charts/MonthBar";

const Analytics = () => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const [summaryRes, categoryRes, compareRes] =
        await Promise.all([
          getMonthlySummary(month, year),
          getCategoryBreakdown(month, year),
          getMonthComparison(month, year),
        ]);

      setSummary(summaryRes.data);
      setCategories(categoryRes.data);
      setComparison(compareRes.data);
    } catch (err) {
      console.error("Analytics error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [month, year]);

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-gray-500">
          Visual breakdown of your spending patterns
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-end">
        <div>
          <label className="text-xs text-gray-500">Month</label>
          <select
            className="block border rounded-md px-3 py-2"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500">Year</label>
          <input
            type="number"
            className="block border rounded-md px-3 py-2 w-28"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">
          Loading analytics…
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <StatCard
                title="Total Spent"
                value={`₹${summary.totalSpent || 0}`}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <StatCard
                title="Total Expenses"
                value={summary.totalExpenses || 0}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <StatCard
                title="Average Expense"
                value={`₹${Math.round(
                  summary.avgExpense || 0
                )}`}
              />
            </div>
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium mb-4">
                Category Breakdown
              </h3>
              <CategoryPie data={categories} />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium mb-4">
                Month Comparison
              </h3>
              {comparison && (
                <MonthBar
                  current={comparison.currentMonth}
                  previous={comparison.previousMonth}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
