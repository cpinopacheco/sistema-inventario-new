"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Por favor, ingrese su email y contraseña");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login(email, password);
    } catch (error) {
      setError("Ocurrió un error al iniciar sesión");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mb-4"
          >
            <img
              src="/img/cenpecar-logo.png"
              alt="CENPECAR Logo"
              className="h-24 w-auto mx-auto"
            />
          </motion.div>
          <h2 className="text-xl font-bold text-primary">
            Centro Nacional de Perfeccionamiento y Capacitación
          </h2>
          <p className="text-primary-light mt-1">
            Sistema de Gestión de Inventario
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="••••••••"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FaLock className="text-gray-400" size={14} />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Para propósitos de demo:</p>
          <p>
            Email: <strong>admin@example.com</strong>
          </p>
          <p>
            Contraseña: <strong>password</strong>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
