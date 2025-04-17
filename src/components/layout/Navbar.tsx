"use client"

import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { FaBars, FaUser, FaBell, FaSignOutAlt } from "react-icons/fa"
import { HiOutlineShoppingCart } from "react-icons/hi"
import { useAuth } from "../../context/AuthContext"
import { useOnClickOutside } from "../../hooks/useOnClickOutside"
import { useWithdrawal } from "../../context/WithdrawalContext"

interface NavbarProps {
  toggleSidebar: () => void
  sidebarOpen: boolean
}

const Navbar = ({ toggleSidebar, sidebarOpen }: NavbarProps) => {
  const { user, logout } = useAuth()
  const { cartTotalItems } = useWithdrawal()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(userMenuRef, () => setUserMenuOpen(false))

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label={sidebarOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
          >
            <FaBars size={24} />
          </button>
          <Link to="/dashboard" className="text-xl font-semibold text-gray-800">
            Sistema de Inventario
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/withdrawals"
            className="relative p-2 text-gray-600 hover:text-gray-900"
            aria-label="Carrito de retiros"
          >
            <HiOutlineShoppingCart size={24} />
            {cartTotalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {cartTotalItems}
              </motion.span>
            )}
          </Link>

          <button className="p-2 text-gray-600 hover:text-gray-900" aria-label="Notificaciones">
            <FaBell size={20} />
          </button>

          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <FaUser className="text-gray-600" />
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">{user?.name}</span>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-500">Sección: {user?.section}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Cerrar Sesión
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
