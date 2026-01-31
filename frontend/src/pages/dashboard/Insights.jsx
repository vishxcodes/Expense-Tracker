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
      setInsights(data.insights);
    } catch (err) {
      setError("Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [month, year]);

  if (loading) return <p>Analyzing your spending...</p>;

  return (
    <div>
      <h1>Smart Insights</h1>

      {/* Month / Year Selector */}
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      {insights.length === 0 ? (
        <p>No insights available for this month.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "1rem",
            maxWidth: "700px",
          }}
        >
          {insights.map((insight, index) => (
            <InsightCard key={index} text={insight} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Insights;
