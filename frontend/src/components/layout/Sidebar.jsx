import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition
     ${
       isActive
         ? "bg-primary text-white"
         : "text-gray-300 hover:bg-gray-800 hover:text-white"
     }`;

  return (
    <aside className="w-64 bg-gray-900 text-white p-5">
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-xl font-bold tracking-wide">
          Expense Tracker
        </h1>
        <p className="text-xs text-gray-400">
          Smart finance management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/dashboard/expenses" className={linkClass}>
          Expenses
        </NavLink>
        <NavLink to="/dashboard/analytics" className={linkClass}>
          Analytics
        </NavLink>
        <NavLink to="/dashboard/budgets" className={linkClass}>
          Budgets
        </NavLink>
        <NavLink to="/dashboard/insights" className={linkClass}>
          Insights
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
