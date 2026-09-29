import { Outlet } from "react-router-dom";
import { UserDashboardPanel } from "../../components/UserDashboardPanel";
import "./dashboard-layout.css";

export function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <UserDashboardPanel />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
