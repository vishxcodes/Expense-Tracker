import { useEffect, useState } from "react";
import {
  createBudget,
  getBudgets,
  deleteBudget,
} from "../../api/budget.api";

const Budgets = () => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    category: "",
    monthlyLimit: "",
  });

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const { data } = await getBudgets(month, year);
      setBudgets(data);
    } catch (err) {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.category || !form.monthlyLimit) {
      setError("Category and limit are required");
      return;
    }

    try {
      await createBudget({
        category: form.category,
        monthlyLimit: Number(form.monthlyLimit),
        month,
        year,
      });

      setForm({ category: "", monthlyLimit: "" });
      fetchBudgets();
    } catch (err) {
      setError("Failed to save budget");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;

    try {
      await deleteBudget(id);
      fetchBudgets();
    } catch (err) {
      setError("Failed to delete budget");
    }
  };

  if (loading) return <p>Loading budgets...</p>;

  return (
    <div>
      <h1>Budgets</h1>

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

      {/* Add / Update Budget */}
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ddd",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3>Set Budget</h3>

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        <input
          placeholder="Category (e.g. Food)"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Monthly Limit"
          value={form.monthlyLimit}
          onChange={(e) =>
            setForm({
              ...form,
              monthlyLimit: e.target.value,
            })
          }
        />

        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          Save
        </button>
      </form>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <p>No budgets set for this month.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {budgets.map((b) => (
            <div
              key={b.category}
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "6px",
              }}
            >
              <h3>{b.category}</h3>

              <p>
                ₹{b.spent} / ₹{b.limit}
              </p>

              {/* Progress bar */}
              <div
                style={{
                  height: "10px",
                  background: "#eee",
                  borderRadius: "5px",
                  overflow: "hidden",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      b.percentageUsed,
                      100
                    )}%`,
                    background:
                      b.alert === "Budget exceeded"
                        ? "red"
                        : b.alert === "Near budget limit"
                        ? "orange"
                        : "green",
                    height: "100%",
                  }}
                />
              </div>

              <p>
                {b.percentageUsed}% used —{" "}
                <strong>{b.alert}</strong>
              </p>

              <button
                onClick={() => handleDelete(b._id)}
                style={{ color: "red" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Budgets;
