"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { FaBoxes, FaExclamationTriangle, FaClipboardList, FaFileAlt, FaArrowUp, FaArrowDown } from "react-icons/fa"
import { useProducts } from "../context/ProductContext"
import { useWithdrawal } from "../context/WithdrawalContext"

const Dashboard = () => {
  const { products, getLowStockProducts } = useProducts()
  const { withdrawals } = useWithdrawal()

  const lowStockProducts = getLowStockProducts()
  const totalProducts = products.length
  const totalCategories = [...new Set(products.map((product) => product.category))].length
  const totalWithdrawals = withdrawals.length

  // Animación para tarjetas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  // Productos recientes
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Retiros recientes
  const recentWithdrawals = [...withdrawals]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total de productos */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FaBoxes className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Productos</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
        </motion.div>

        {/* Productos con stock bajo */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <FaExclamationTriangle className="text-red-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Stock Bajo</p>
            <p className="text-2xl font-bold">{lowStockProducts.length}</p>
          </div>
        </motion.div>

        {/* Total de categorías */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FaClipboardList className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Categorías</p>
            <p className="text-2xl font-bold">{totalCategories}</p>
          </div>
        </motion.div>

        {/* Total de retiros */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <FaFileAlt className="text-purple-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Retiros</p>
            <p className="text-2xl font-bold">{totalWithdrawals}</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos recientes */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Productos Recientes</h2>
            <Link to="/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver todos
            </Link>
          </div>
          <div className="p-4">
            {recentProducts.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentProducts.map((product) => (
                  <div key={product.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaBoxes className="text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{product.stock} unidades</p>
                      <p className={`text-xs ${product.stock <= product.minStock ? "text-red-600" : "text-green-600"}`}>
                        {product.stock <= product.minStock ? "Stock bajo" : "En stock"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay productos registrados aún</p>
            )}
          </div>
        </motion.div>

        {/* Retiros recientes */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Retiros Recientes</h2>
            <Link to="/withdrawals" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
              Ver todos
            </Link>
          </div>
          <div className="p-4">
            {recentWithdrawals.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentWithdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Retiro #{withdrawal.id} - {withdrawal.userName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(withdrawal.createdAt).toLocaleDateString()} - {withdrawal.userSection}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{withdrawal.totalItems} items</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay retiros registrados aún</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Estadísticas */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Resumen de Inventario</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium mb-3 text-gray-700">Principales Categorías</h3>
              <div className="space-y-2">
                {Object.entries(
                  products.reduce(
                    (acc, product) => {
                      acc[product.category] = (acc[product.category] || 0) + 1
                      return acc
                    },
                    {} as Record<string, number>,
                  ),
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <p className="text-sm">{category}</p>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">{count}</span>
                        <div className="bg-gray-200 h-2 w-36 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${(count / totalProducts) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium mb-3 text-gray-700">Productos con Mayor Movimiento</h3>
              <div className="space-y-2">
                {products.slice(0, 4).map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <p className="text-sm truncate max-w-[180px]">{product.name}</p>
                    <div className="flex items-center">
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center ${
                          product.stock > product.minStock * 2
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock > product.minStock * 2 ? (
                          <FaArrowUp className="mr-1" />
                        ) : (
                          <FaArrowDown className="mr-1" />
                        )}
                        {product.stock} unidades
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
