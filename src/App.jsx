import { Routes,Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Register";
import Register from "./components/Login";

export default function App() {
  return (
    <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Register />} />
        <Route path="/registro" element={<Login />} />
    </Routes>
  );
}
