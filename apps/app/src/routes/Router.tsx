import { Route, Routes } from "react-router";
import DashboardPage from "../pages/DashboardPage";
import WebsitesPage from "../pages/WebsitesPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../shared/layouts/MainLayout";
import AddWebsitePage from "../pages/AddWebsitePage";

export default function Router() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/sites" element={<WebsitesPage />} />
        <Route path="/sites/add" element={<AddWebsitePage />} />
        <Route path="/sites/:domain" element={<DashboardPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* <Route element={<MainLayout />}>{renderRoutes(routes)}</Route> */}
      {/* <Route path="*" element={<GenericNotFound />} /> */}
    </Routes>
  );
}
