import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside style={{ width: "220px", background: "#111", color: "#fff" }}>
      <h2 style={{ padding: "1rem" }}>Expense Tracker</h2>

      <nav style={{ display: "flex", flexDirection: "column" }}>
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/dashboard/expenses" style={linkStyle}>Expenses</NavLink>
        <NavLink to="/dashboard/analytics" style={linkStyle}>Analytics</NavLink>
        <NavLink to="/dashboard/budgets" style={linkStyle}>Budgets</NavLink>
        <NavLink to="/dashboard/insights" style={linkStyle}>Insights</NavLink>
      </nav>
    </aside>
  );
};

const linkStyle = ({ isActive }) => ({
  padding: "0.75rem 1rem",
  color: isActive ? "#4ade80" : "#fff",
  textDecoration: "none",
});

export default Sidebar;
