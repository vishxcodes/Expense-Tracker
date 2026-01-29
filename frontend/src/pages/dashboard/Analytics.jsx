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
    setLoading(true);

    try {
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

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div>
      <h1>Analytics</h1>

      {/* Filters */}
      <div style={{ marginBottom: "1rem" }}>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Month {i + 1}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          title="Total Spent"
          value={`₹${summary.totalSpent || 0}`}
        />
        <StatCard
          title="Total Expenses"
          value={summary.totalExpenses || 0}
        />
        <StatCard
          title="Average Expense"
          value={`₹${Math.round(summary.avgExpense || 0)}`}
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <CategoryPie data={categories} />
        {comparison && (
          <MonthBar
            current={comparison.currentMonth}
            previous={comparison.previousMonth}
          />
        )}
      </div>
    </div>
  );
};

export default Analytics;
