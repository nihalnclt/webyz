import { Route, Routes } from "react-router";
import DashboardPage from "../pages/DashboardPage";
import WebsitesPage from "../pages/WebsitesPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/websites" element={<WebsitesPage />} />
      {/* <Route element={<MainLayout />}>{renderRoutes(routes)}</Route> */}
      {/* <Route path="*" element={<GenericNotFound />} /> */}
    </Routes>
  );
}
