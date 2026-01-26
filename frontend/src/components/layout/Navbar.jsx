import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        height: "60px",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 1rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      <span>Welcome, {user?.name}</span>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Navbar;
