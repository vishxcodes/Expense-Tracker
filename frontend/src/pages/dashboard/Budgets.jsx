import { useEffect, useState } from "react";
import {
  getBudgets,
  createBudget,
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
    } catch {
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
    } catch {
      setError("Failed to save budget");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;

    try {
      await deleteBudget(id);
      fetchBudgets();
    } catch {
      setError("Failed to delete budget");
    }
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusText = (percentage) => {
    if (percentage >= 100) return "Budget exceeded";
    if (percentage >= 80) return "Near budget limit";
    return "Within budget";
  };

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <p className="text-sm text-gray-500">
          Set spending limits and track usage
        </p>
      </div>

      {/* MONTH / YEAR FILTER */}
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

      {/* ADD BUDGET CARD */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-medium mb-4">Set Budget</h3>

        {error && (
          <p className="text-sm text-red-500 mb-3">{error}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            placeholder="Category (e.g. Food)"
            className="border rounded-md px-3 py-2"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Monthly limit"
            className="border rounded-md px-3 py-2"
            value={form.monthlyLimit}
            onChange={(e) =>
              setForm({
                ...form,
                monthlyLimit: e.target.value,
              })
            }
          />

          <button className="btn-primary md:col-span-3">
            Save Budget
          </button>
        </form>
      </div>

      {/* BUDGET CARDS */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">
          Loading budgets…
        </p>
      ) : budgets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          <p className="font-medium">No budgets set</p>
          <p className="text-sm">
            Add a budget to start tracking spending
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-xl shadow-sm p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{b.category}</h3>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>

              <p className="text-sm text-gray-600">
                ₹{b.spent} / ₹{b.limit}
              </p>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStatusColor(
                    b.percentageUsed
                  )}`}
                  style={{
                    width: `${Math.min(
                      b.percentageUsed,
                      100
                    )}%`,
                  }}
                />
              </div>

              <p className="text-sm text-gray-500">
                {b.percentageUsed}% used —{" "}
                <span className="font-medium">
                  {getStatusText(b.percentageUsed)}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Budgets;
