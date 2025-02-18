import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cuti from "./pages/Cuti";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized"
import RoleBasedRoutes from "./utils/RoleBasedRoutes";
import AdminDashboard from "./admin/pages/AdminDashboard"
import AdminLayout from "./admin/layouts/AdminLayout"
import AdminCuti from "./admin/pages/AdminCuti"
import EditUser from "./admin/pages/EditUser"
import AdminRiwayatCuti from "./admin/pages/AdminRiwayatCuti";
import Absen from "./pages/Absen"
import AdminAbsen from "./admin/pages/AdminAbsen";
import RiwayatAbsen from "./pages/RiwayatAbsen";
import RiwayatCuti from "./pages/RiwayatCuti";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <RoleBasedRoutes requiredRole={"user"}>
              <Layout />
            </RoleBasedRoutes>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/absen" element={<Absen />} />
          <Route path="/absen/riwayat" element={<RiwayatAbsen />} />
          <Route path="/cuti" element={<Cuti />} />
          <Route path="/cuti/riwayat" element={<RiwayatCuti />} />
        </Route>
        <Route
          path="/admin"
          element={
            <RoleBasedRoutes requiredRole={"admin"}>
              <AdminLayout />
            </RoleBasedRoutes>
          }
        >
           <Route index element={<AdminDashboard />} />
           <Route path="kelolaabsen" element={<AdminAbsen />} />
           <Route path="kelolacuti" element={<AdminCuti />} />
           <Route path="riwayatcuti" element={<AdminRiwayatCuti/>}/>
           <Route path="edituser/:id" element={<EditUser/>} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
