"use client";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { WithdrawalProvider } from "./context/WithdrawalContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Withdrawals from "./pages/Withdrawals";
import Reports from "./pages/Reports";
import LowStock from "./pages/LowStock";
import Statistics from "./pages/Statistics";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AuthProvider>
          <ProductProvider>
            <WithdrawalProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                }}
              />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="withdrawals" element={<Withdrawals />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="low-stock" element={<LowStock />} />
                  <Route path="statistics" element={<Statistics />} />
                </Route>
              </Routes>
            </WithdrawalProvider>
          </ProductProvider>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
