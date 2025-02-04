import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cuti from "./pages/Cuti";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/cuti" element={<Cuti />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
