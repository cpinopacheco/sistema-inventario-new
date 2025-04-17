"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";
import { useProducts } from "../context/ProductContext";
import { useWithdrawal } from "../context/WithdrawalContext";

const Statistics = () => {
  const { products } = useProducts();
  const { withdrawals } = useWithdrawal();
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  // Calcular estadísticas por categoría
  const categoryStats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Obtener categorías ordenadas por cantidad de productos
  const sortedCategories = Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calcular total de productos
  const totalProducts = products.length;

  // Calcular productos con stock bajo
  const lowStockProducts = products.filter(
    (product) => product.stock <= product.minStock
  );

  // Calcular estadísticas de retiros
  const totalWithdrawals = withdrawals.length;
  const totalItemsWithdrawn = withdrawals.reduce(
    (sum, withdrawal) => sum + withdrawal.totalItems,
    0
  );

  // Productos más retirados
  const productWithdrawalStats: Record<number, number> = {};
  withdrawals.forEach((withdrawal) => {
    withdrawal.items.forEach((item) => {
      productWithdrawalStats[item.productId] =
        (productWithdrawalStats[item.productId] || 0) + item.quantity;
    });
  });

  // Obtener productos más retirados
  const topWithdrawnProducts = Object.entries(productWithdrawalStats)
    .sort(
      (a, b) =>
        Number.parseInt(b[1].toString()) - Number.parseInt(a[1].toString())
    )
    .slice(0, 5)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p.id === Number.parseInt(productId));
      return {
        id: productId,
        name: product?.name || "Producto desconocido",
        quantity,
      };
    });

  // Estadísticas por sección
  const sectionStats = withdrawals.reduce((acc, withdrawal) => {
    acc[withdrawal.userSection] =
      (acc[withdrawal.userSection] || 0) + withdrawal.totalItems;
    return acc;
  }, {} as Record<string, number>);

  // Obtener secciones ordenadas por cantidad de items retirados
  const sortedSections = Object.entries(sectionStats).sort(
    (a, b) => b[1] - a[1]
  );

  // Animar las barras
  const barAnimations = {
    initial: { width: 0 },
    animate: (i: number) => ({
      width: "100%",
      transition: {
        duration: 0.5,
        delay: i * 0.1,
      },
    }),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Estadísticas</h1>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setPeriod("week")}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              period === "week"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-gray-300`}
          >
            Semanal
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-4 py-2 text-sm font-medium ${
              period === "month"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border-t border-b border-gray-300`}
          >
            Mensual
          </button>
          <button
            onClick={() => setPeriod("year")}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              period === "year"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-gray-300`}
          >
            Anual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-primary-light bg-opacity-30 p-3 mr-4">
              <FaChartBar className="text-primary text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Productos</p>
              <p className="text-2xl font-bold text-primary">{totalProducts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <FaChartLine className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stock Bajo</p>
              <p className="text-2xl font-bold text-red-600">
                {lowStockProducts.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-primary-light bg-opacity-50 p-3 mr-4">
              <FaChartPie className="text-primary text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Retiros</p>
              <p className="text-2xl font-bold text-primary">
                {totalWithdrawals}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-secondary bg-opacity-20 p-3 mr-4">
              <FaCalendarAlt className="text-secondary text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Items Retirados</p>
              <p className="text-2xl font-bold text-secondary">
                {totalItemsWithdrawn}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 bg-primary bg-opacity-10 border-b border-primary border-opacity-20">
            <h2 className="text-lg font-semibold text-primary">
              Distribución por Categoría
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {sortedCategories.map(([category, count], index) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900">
                      {category}
                    </span>
                    <span className="text-gray-500">{count} productos</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    {isBrowser && (
                      <motion.div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${(count / totalProducts) * 100}%` }}
                        initial="initial"
                        animate="animate"
                        custom={index}
                        variants={barAnimations}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 bg-secondary bg-opacity-10 border-b border-secondary border-opacity-20">
            <h2 className="text-lg font-semibold text-primary">
              Productos Más Retirados
            </h2>
          </div>
          <div className="p-6">
            {topWithdrawnProducts.length > 0 ? (
              <div className="space-y-4">
                {topWithdrawnProducts.map(({ id, name, quantity }, index) => (
                  <div key={id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900">{name}</span>
                      <span className="text-gray-500">{quantity} unidades</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      {isBrowser && (
                        <motion.div
                          className="bg-secondary h-2.5 rounded-full"
                          style={{
                            width: `${
                              (quantity /
                                Math.max(
                                  ...topWithdrawnProducts.map((p) => p.quantity)
                                )) *
                              100
                            }%`,
                          }}
                          initial="initial"
                          animate="animate"
                          custom={index}
                          variants={barAnimations}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaChartPie className="mx-auto text-primary-light text-5xl mb-4" />
                <h3 className="text-lg font-medium text-primary mb-1">
                  No hay datos para mostrar
                </h3>
                <p className="text-gray-500">
                  Aún no se han registrado retiros de productos
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="px-6 py-4 bg-primary-light bg-opacity-20 border-b border-primary-light border-opacity-30">
          <h2 className="text-lg font-semibold text-primary">
            Retiros por Sección
          </h2>
        </div>
        <div className="p-6">
          {sortedSections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                {sortedSections.map(([section, count], index) => (
                  <div key={section}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900">
                        {section}
                      </span>
                      <span className="text-gray-500">{count} items</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      {isBrowser && (
                        <motion.div
                          className="bg-primary-light h-2.5 rounded-full"
                          style={{
                            width: `${
                              (count /
                                Math.max(...sortedSections.map((s) => s[1]))) *
                              100
                            }%`,
                          }}
                          initial="initial"
                          animate="animate"
                          custom={index}
                          variants={barAnimations}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {sortedSections.length}
                  </div>
                  <p className="text-sm text-gray-500">Secciones Activas</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaChartPie className="mx-auto text-primary-light text-5xl mb-4" />
              <h3 className="text-lg font-medium text-primary mb-1">
                No hay datos para mostrar
              </h3>
              <p className="text-gray-500">
                Aún no se han registrado retiros por sección
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Statistics;
