"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaExclamationTriangle, FaPlus, FaSearch, FaFileExcel } from "react-icons/fa"
import { useProducts } from "../context/ProductContext"
import { useWithdrawal } from "../context/WithdrawalContext"
import { Tooltip } from "../components/ui/Tooltip"
import { ExportToExcel } from "../utils/ExcelExport"

const LowStock = () => {
  const { products, getLowStockProducts } = useProducts()
  const { addToCart } = useWithdrawal()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Obtener productos con stock bajo
  const lowStockProducts = getLowStockProducts()

  // Categorías únicas de productos con stock bajo
  const categories = ["all", ...new Set(lowStockProducts.map((product) => product.category))]

  // Filtrar productos
  const filteredProducts = lowStockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Exportar a Excel
  const exportToExcel = () => {
    const data = filteredProducts.map((product) => ({
      Nombre: product.name,
      Descripción: product.description,
      Categoría: product.category,
      "Stock Actual": product.stock,
      "Stock Mínimo": product.minStock,
      Déficit: product.minStock - product.stock,
      Ubicación: product.location,
      Precio: product.price,
    }))

    ExportToExcel(data, "Productos_Stock_Bajo")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Productos con Stock Bajo</h1>
        <button
          onClick={exportToExcel}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FaFileExcel className="mr-2" />
          Exportar a Excel
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full md:w-1/2 relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">Todas las categorías</option>
            {categories
              .filter((cat) => cat !== "all")
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Alerta de Stock Bajo</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Se han encontrado {filteredProducts.length} productos con stock por debajo del mínimo requerido. Estos
                  productos necesitan reabastecimiento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Mínimo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Déficit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">{product.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-red-600">{product.stock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.minStock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">{product.minStock - product.stock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Tooltip content="Añadir al retiro">
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="text-blue-600 hover:text-blue-900"
                          disabled={product.stock <= 0}
                        >
                          <FaPlus size={16} />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FaExclamationTriangle className="mx-auto text-gray-400 text-5xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron productos</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== "all"
                  ? "No hay productos que coincidan con los filtros seleccionados."
                  : "No hay productos con stock bajo. ¡Todo está en orden!"}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LowStock
