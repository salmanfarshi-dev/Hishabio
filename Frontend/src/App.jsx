import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
function App() {
  return (
    <>

     <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#FFFFFF",
            color: "#111827",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#16A34A",
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#DC2626",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
    </>
  );
}

export default App;