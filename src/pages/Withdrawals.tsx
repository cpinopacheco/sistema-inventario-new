"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaTrash,
  FaTimes,
  FaCheck,
  FaFileExcel,
  FaClipboardList,
} from "react-icons/fa";
import { useWithdrawal } from "../context/WithdrawalContext";
import { Tooltip } from "../components/ui/Tooltip";
import { ExportToExcel } from "../utils/ExcelExport";
import { useNavigate } from "react-router-dom";

const Withdrawals = () => {
  const {
    cart,
    withdrawals,
    removeFromCart,
    updateCartItemQuantity,
    confirmWithdrawal,
  } = useWithdrawal();
  const [notes, setNotes] = useState("");
  const [showWithdrawalHistory, setShowWithdrawalHistory] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<number | null>(
    null
  );
  const navigate = useNavigate();

  // Calcular el total de items en el carrito
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Manejar cambio de cantidad
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateCartItemQuantity(productId, newQuantity);
  };

  // Manejar confirmación de retiro
  const handleConfirmWithdrawal = () => {
    confirmWithdrawal(notes);
    setNotes("");
  };

  // Manejar exportación a Excel
  const handleExportToExcel = (withdrawalId: number) => {
    const withdrawal = withdrawals.find((w) => w.id === withdrawalId);
    if (!withdrawal) return;

    const withdrawalData = withdrawal.items.map((item) => ({
      Producto: item.product.name,
      Categoría: item.product.category,
      Cantidad: item.quantity,
      "Fecha de retiro": new Date(withdrawal.createdAt).toLocaleDateString(),
      "Hora de retiro": new Date(withdrawal.createdAt).toLocaleTimeString(),
      "Usuario que retira": withdrawal.userName,
      Sección: withdrawal.userSection,
      Notas: withdrawal.notes || "N/A",
    }));

    ExportToExcel(
      withdrawalData,
      `Retiro-${withdrawalId}-${new Date(
        withdrawal.createdAt
      ).toLocaleDateString()}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Gestión de Retiros</h1>
        <button
          onClick={() => setShowWithdrawalHistory(!showWithdrawalHistory)}
          className={`px-4 py-2 rounded-md ${
            showWithdrawalHistory
              ? "bg-primary-light text-primary hover:bg-opacity-90"
              : "bg-primary text-white hover:bg-opacity-90"
          } transition-colors`}
        >
          {showWithdrawalHistory
            ? "Volver a Retiros"
            : "Ver Historial de Retiros"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showWithdrawalHistory ? (
          <motion.div
            key="cart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary flex items-center">
                  <FaShoppingCart className="mr-2 text-primary" />
                  Carrito de Retiro
                </h2>
                <span className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-medium">
                  {cartTotalItems} {cartTotalItems === 1 ? "ítem" : "ítems"}
                </span>
              </div>

              {cart.length > 0 ? (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cart.map((item) => (
                          <tr key={item.productId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                                  {item.product.image ? (
                                    <img
                                      src={
                                        item.product.image || "/placeholder.svg"
                                      }
                                      alt={item.product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <FaClipboardList className="text-gray-400" />
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.product.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.product.category}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.productId,
                                      Math.max(1, item.quantity - 1)
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
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.productId,
                                      Number.parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-20 py-1 text-center border-t border-b border-gray-300"
                                />
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.productId,
                                      item.quantity + 1
                                    )
                                  }
                                  className="px-2 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300"
                                  aria-label="Aumentar cantidad"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Tooltip content="Eliminar del carrito">
                                <button
                                  onClick={() => removeFromCart(item.productId)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FaTrash size={16} />
                                </button>
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t pt-4">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Notas adicionales (opcional)
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="Añade notas adicionales sobre este retiro..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleConfirmWithdrawal}
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      <FaCheck className="mr-2" />
                      Confirmar Retiro
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaShoppingCart className="mx-auto text-primary-light text-5xl mb-4" />
                  <h3 className="text-lg font-medium text-primary mb-1">
                    El carrito está vacío
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Agrega productos desde la sección de Productos para iniciar
                    un retiro
                  </p>
                  <button
                    onClick={() => navigate("/products")}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    Ir a Productos
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-primary">
                  Historial de Retiros
                </h2>
              </div>

              {withdrawals.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-primary">
                          Retiro #{withdrawal.id} - {withdrawal.userName}
                        </h3>
                        <div className="flex space-x-2">
                          <Tooltip content="Exportar a Excel">
                            <button
                              onClick={() => handleExportToExcel(withdrawal.id)}
                              className="text-primary hover:text-primary-light"
                            >
                              <FaFileExcel size={18} />
                            </button>
                          </Tooltip>
                          <button
                            onClick={() =>
                              setSelectedWithdrawal(
                                selectedWithdrawal === withdrawal.id
                                  ? null
                                  : withdrawal.id
                              )
                            }
                            className="text-primary hover:text-primary-light"
                          >
                            {selectedWithdrawal === withdrawal.id ? (
                              <FaTimes size={18} />
                            ) : (
                              <FaClipboardList size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        Fecha:{" "}
                        {new Date(withdrawal.createdAt).toLocaleDateString()}{" "}
                        {new Date(withdrawal.createdAt).toLocaleTimeString()} -
                        Sección: {withdrawal.userSection} - Items:{" "}
                        {withdrawal.totalItems}
                      </div>

                      {withdrawal.notes && (
                        <div className="text-sm text-gray-600 mb-2 italic">
                          "{withdrawal.notes}"
                        </div>
                      )}

                      <AnimatePresence>
                        {selectedWithdrawal === withdrawal.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 overflow-hidden"
                          >
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Detalle de productos:
                            </h4>
                            <div className="bg-gray-50 rounded-md overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Producto
                                    </th>
                                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Categoría
                                    </th>
                                    <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Cantidad
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {withdrawal.items.map((item) => (
                                    <tr
                                      key={item.productId}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                                        {item.product.name}
                                      </td>
                                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {item.product.category}
                                      </td>
                                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {item.quantity}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaClipboardList className="mx-auto text-primary-light text-5xl mb-4" />
                  <h3 className="text-lg font-medium text-primary mb-1">
                    No hay retiros registrados
                  </h3>
                  <p className="text-gray-500">
                    Aún no se han realizado retiros de productos del inventario
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Withdrawals;
