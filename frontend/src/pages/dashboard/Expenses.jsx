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

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await getExpenses();
      setExpenses(data);
    } catch (err) {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
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

      // Reset form
      setForm({
        amount: "",
        category: "",
        description: "",
        paymentMethod: "cash",
      });

      // Refresh list
      fetchExpenses();
    } catch (err) {
      setError("Failed to add expense");
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      setError("Failed to delete expense");
    }
  };

  if (loading) return <p>Loading expenses...</p>;

  return (
    <div>
      <h1>Expenses</h1>

      {/* ADD EXPENSE FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          border: "1px solid #ddd",
        }}
      >
        <h3>Add Expense</h3>

        {error && (
          <p style={{ color: "red", marginBottom: "0.5rem" }}>
            {error}
          </p>
        )}

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <input
          placeholder="Category (e.g. Food)"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          value={form.paymentMethod}
          onChange={(e) =>
            setForm({ ...form, paymentMethod: e.target.value })
          }
        >
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
        </select>

        <br />
        <button type="submit" style={{ marginTop: "0.5rem" }}>
          Add Expense
        </button>
      </form>

      {/* EXPENSE LIST */}
      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          width="100%"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount (₹)</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td>{expense.category}</td>
                <td>{expense.description || "-"}</td>
                <td>{expense.amount}</td>
                <td>{expense.paymentMethod}</td>
                <td>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    style={{ color: "red" }}
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
  );
};

export default Expenses;
