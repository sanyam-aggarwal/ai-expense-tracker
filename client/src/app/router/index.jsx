import { Navigate, Route, Routes } from "react-router-dom";
import { GOOGLE_CLIENT_ID } from "../../config/env";
import { AuthPage } from "../../features/auth/AuthPage";
import { authService } from "../authService";
import Analytics from "../components/Analytics";
import Expenses from "../components/Expenses";
import Profile from "../components/Profile";
import Home from "../components/Home";
import { DashboardLayout } from "../layouts/DashboardLayout";

function ProtectedRoute() {
  return authService.isAuthenticated() ? <DashboardLayout /> : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          authService.isAuthenticated() ? (
            <Navigate to="/profile" replace />
          ) : (
            <AuthPage googleEnabled={Boolean(GOOGLE_CLIENT_ID)} />
          )
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
}
