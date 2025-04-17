"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBoxes,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { useProducts, type Product } from "../context/ProductContext";
import { useWithdrawal } from "../context/WithdrawalContext";
import ProductForm from "../components/products/ProductForm";
import { Tooltip } from "../components/ui/Tooltip";

const Products = () => {
  const { products, categories, deleteProduct } = useProducts();
  const { addToCart } = useWithdrawal();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<"name" | "stock" | "category">(
    "name"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [quantityInputs, setQuantityInputs] = useState<Record<number, number>>(
    {}
  );
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Inicializar cantidades
  useEffect(() => {
    const initialQuantities: Record<number, number> = {};
    products.forEach((product) => {
      initialQuantities[product.id] = 1;
    });
    setQuantityInputs(initialQuantities);
  }, [products]);

  // Función para cambiar cantidad
  const handleQuantityChange = (id: number, value: number) => {
    if (value < 1) value = 1;
    setQuantityInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Función para abrir modal de edición
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  // Función para confirmar eliminación
  const handleDeleteConfirm = (id: number) => {
    setConfirmDelete(id);
  };

  // Función para eliminar producto
  const handleDelete = (id: number) => {
    deleteProduct(id);
    setConfirmDelete(null);
  };

  // Función para agregar al carrito
  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
  };

  // Función para cambiar el ordenamiento
  const handleSort = (field: "name" | "stock" | "category") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtrar y ordenar productos
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "stock") {
        return sortDirection === "asc" ? a.stock - b.stock : b.stock - a.stock;
      } else if (sortField === "category") {
        return sortDirection === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-primary">
          Gestión de Productos
        </h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowProductForm(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          <FaPlus className="mr-2" />
          Nuevo Producto
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="w-full md:w-1/2 flex gap-2">
          <div className="relative flex-1">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center focus:outline-none"
                    >
                      Producto
                      {sortField === "name" &&
                        (sortDirection === "asc" ? (
                          <FaSortAmountUp className="ml-1 text-gray-400" />
                        ) : (
                          <FaSortAmountDown className="ml-1 text-gray-400" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("category")}
                      className="flex items-center focus:outline-none"
                    >
                      Categoría
                      {sortField === "category" &&
                        (sortDirection === "asc" ? (
                          <FaSortAmountUp className="ml-1 text-gray-400" />
                        ) : (
                          <FaSortAmountDown className="ml-1 text-gray-400" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("stock")}
                      className="flex items-center focus:outline-none"
                    >
                      Stock
                      {sortField === "stock" &&
                        (sortDirection === "asc" ? (
                          <FaSortAmountUp className="ml-1 text-gray-400" />
                        ) : (
                          <FaSortAmountDown className="ml-1 text-gray-400" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50 ${
                      product.stock <= product.minStock ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
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
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-light bg-opacity-30 text-primary">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          product.stock <= product.minStock
                            ? "text-red-600"
                            : product.stock <= product.minStock * 2
                            ? "text-secondary"
                            : "text-primary"
                        }`}
                      >
                        {product.stock} unidades
                      </div>
                      {product.stock <= product.minStock && (
                        <div className="text-xs text-red-600">Stock bajo</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.location || "No especificada"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end">
                        <div className="flex items-center mr-6">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.id,
                                Math.max(
                                  1,
                                  (quantityInputs[product.id] || 1) - 1
                                )
                              )
                            }
                            className="px-2 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300"
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={quantityInputs[product.id] || 1}
                            onChange={(e) =>
                              handleQuantityChange(
                                product.id,
                                Number.parseInt(e.target.value) || 1
                              )
                            }
                            className="w-20 py-1 text-center border-t border-b border-gray-300"
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.id,
                                (quantityInputs[product.id] || 1) + 1
                              )
                            }
                            className="px-2 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex space-x-3">
                          <Tooltip content="Añadir al retiro">
                            <button
                              onClick={() =>
                                handleAddToCart(
                                  product,
                                  quantityInputs[product.id] || 1
                                )
                              }
                              className="text-primary hover:text-primary-light"
                              disabled={product.stock <= 0}
                            >
                              <FaPlus size={16} />
                            </button>
                          </Tooltip>

                          <Tooltip content="Editar">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-accent hover:text-accent-light"
                            >
                              <FaEdit size={16} />
                            </button>
                          </Tooltip>

                          <Tooltip content="Eliminar">
                            <button
                              onClick={() => handleDeleteConfirm(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash size={16} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaBoxes className="mx-auto text-primary-light text-5xl mb-4" />
          <h3 className="text-lg font-medium text-primary mb-1">
            No se encontraron productos
          </h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza agregando tu primer producto"}
          </p>
        </div>
      )}

      <AnimatePresence>
        {showProductForm && (
          <ProductForm
            product={selectedProduct || undefined}
            onClose={() => {
              setShowProductForm(false);
              setSelectedProduct(null);
            }}
            isVisible={showProductForm}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-medium text-primary mb-3">
                Confirmar eliminación
              </h3>
              <p className="text-gray-500 mb-6">
                ¿Estás seguro de que deseas eliminar este producto? Esta acción
                no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
