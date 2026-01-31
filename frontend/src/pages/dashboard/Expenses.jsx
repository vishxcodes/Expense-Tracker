import { useEffect, useState } from "react";
import {
  getExpenses,
  createExpense,
  deleteExpense,
} from "../../api/expense.api";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    paymentMethod: "cash",
  });

  const [filters, setFilters] = useState({
    month: "",
    year: "",
    category: "",
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await getExpenses(filters);
      setExpenses(data);
    } catch {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.amount || !form.category) {
      setError("Amount and category are required");
      return;
    }

    try {
      await createExpense({
        ...form,
        amount: Number(form.amount),
      });

      setForm({
        amount: "",
        category: "",
        description: "",
        paymentMethod: "cash",
      });

      fetchExpenses();
    } catch {
      setError("Failed to add expense");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch {
      setError("Failed to delete expense");
    }
  };

  return (
    
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Expenses
        </h1>
        <p className="text-sm text-gray-500">
          Track and manage your daily spending
        </p>
      </div>

      {/* FILTERS CARD */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-xs text-gray-500">Month</label>
          <select
            className="block border rounded-md px-3 py-2 w-28"
            value={filters.month}
            onChange={(e) =>
              setFilters({ ...filters, month: e.target.value })
            }
          >
            <option value="">All</option>
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
            value={filters.year}
            onChange={(e) =>
              setFilters({ ...filters, year: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Category</label>
          <input
            className="block border rounded-md px-3 py-2 w-40"
            placeholder="Food, Travel…"
            value={filters.category}
            onChange={(e) =>
              setFilters({
                ...filters,
                category: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={() =>
            setFilters({ month: "", year: "", category: "" })
          }
          className="ml-auto text-sm text-gray-500 hover:underline"
        >
          Clear filters
        </button>
      </div>

      {/* ADD EXPENSE CARD */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-medium mb-4">Add Expense</h3>

        {error && (
          <p className="text-sm text-red-500 mb-3">{error}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="number"
            placeholder="Amount"
            className="border rounded-md px-3 py-2"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <input
            placeholder="Category"
            className="border rounded-md px-3 py-2"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <input
            placeholder="Description"
            className="border rounded-md px-3 py-2"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <select
            className="border rounded-md px-3 py-2"
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({
                ...form,
                paymentMethod: e.target.value,
              })
            }
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          <button
            type="submit"
            className="md:col-span-4 bg-primary text-white rounded-md py-2 hover:opacity-90"
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* EXPENSES TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500 animate-pulse">
            Loading expenses…
          </p>
        ) : expenses.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <p className="font-medium">No expenses yet</p>
            <p className="text-sm">
              Add your first expense to get started
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Payment</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium">
                    {expense.category}
                  </td>
                  <td className="p-4">
                    {expense.description || "-"}
                  </td>
                  <td className="p-4 font-semibold">
                    ₹{expense.amount}
                  </td>
                  <td className="p-4">
                    {expense.paymentMethod}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        handleDelete(expense._id)
                      }
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Expenses;
