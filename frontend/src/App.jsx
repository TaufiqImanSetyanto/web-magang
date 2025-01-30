import { Route, Routes } from "react-router-dom";
import Layout  from "./pages/Layout";
import Login  from "./pages/Login";
import Register  from "./pages/Register";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
