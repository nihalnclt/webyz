import { Route, Routes } from "react-router";
import DashboardPage from "../pages/DashboardPage";
import WebsitesPage from "../pages/WebsitesPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ProtectedRoute from "./ProtectedRoute";

export default function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/websites"
        element={
          <ProtectedRoute>
            <WebsitesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* <Route element={<MainLayout />}>{renderRoutes(routes)}</Route> */}
      {/* <Route path="*" element={<GenericNotFound />} /> */}
    </Routes>
  );
}
