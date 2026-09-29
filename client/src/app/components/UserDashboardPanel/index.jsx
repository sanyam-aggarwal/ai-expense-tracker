import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../authService";
import "./user-dashboard-panel.css";

const navigation = [
  { to: "/profile", label: "Profile" },
  { to: "/expenses", label: "Expenses" },
  { to: "/analytics", label: "Analytics" },
];

export function UserDashboardPanel() {
  const navigate = useNavigate();
  const user = authService.getUserDetails();
  const logout = () => {
    authService.logout();
    navigate("/");
  };
  return (
    <aside className="user-dashboard-panel">
      <div className="dashboard-brand">
        <span>S</span> Spendwise
      </div>
      <div className="dashboard-user">
        <div className="avatar">{user?.name?.[0] || user?.phone?.[1] || "U"}</div>
        <div>
          <strong>{user?.name || "Your account"}</strong>
          <small>{user?.email || user?.phone}</small>
        </div>
      </div>
      <nav className="dashboard-navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `dashboard-link${isActive ? " active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button className="logout-button" onClick={logout}>
        Log out
      </button>
    </aside>
  );
}
