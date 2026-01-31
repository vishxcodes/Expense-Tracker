import { useEffect, useState } from "react";
import { getInsights } from "../../api/insights.api";
import InsightCard from "../../components/cards/InsightCard";

const Insights = () => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const { data } = await getInsights(month, year);
      setInsights(data.insights || []);
    } catch {
      setError("Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [month, year]);

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Smart Insights</h1>
        <p className="text-sm text-gray-500">
          Personalized analysis of your spending habits
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

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">
          Analyzing your spending…
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : insights.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          <p className="font-medium">No insights available</p>
          <p className="text-sm">
            Add more expenses to unlock insights
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <InsightCard key={index} text={insight} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Insights;
