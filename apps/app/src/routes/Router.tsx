import { Route, Routes } from "react-router";
import DashboardPage from "../pages/DashboardPage";


export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      {/* <Route element={<MainLayout />}>{renderRoutes(routes)}</Route> */}
      {/* <Route path="*" element={<GenericNotFound />} /> */}
    </Routes>
  );
}
