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
import Presensi from "./pages/Presensi"
import AdminPresensi from "./admin/pages/AdminPresensi";
import RiwayatPresensi from "./pages/RiwayatPresensi";
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
          <Route path="/presensi" element={<Presensi />} />
          <Route path="/presensi/riwayat" element={<RiwayatPresensi />} />
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
           <Route path="kelolapresensi" element={<AdminPresensi />} />
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
