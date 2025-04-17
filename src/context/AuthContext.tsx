"use client"

import { createContext, useState, useContext, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

// Define los tipos para los usuarios
interface User {
  id: number
  name: string
  email: string
  role: "admin" | "user"
  section: string
}

// Define los tipos para el contexto
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuario de muestra para desarrollo
const sampleUser: User = {
  id: 1,
  name: "Admin Usuario",
  email: "admin@example.com",
  role: "admin",
  section: "IT",
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })
  const navigate = useNavigate()

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      // Simulación de autenticación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En una aplicación real, aquí se verificarían las credenciales con el backend
      if (email === "admin@example.com" && password === "password") {
        setUser(sampleUser)
        localStorage.setItem("user", JSON.stringify(sampleUser))
        toast.success("Inicio de sesión exitoso")
        navigate("/dashboard")
      } else {
        toast.error("Credenciales incorrectas")
      }
    } catch (error) {
      toast.error("Error al iniciar sesión")
      console.error("Login error:", error)
    }
  }

  // Función para cerrar sesión
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    toast.success("Sesión cerrada")
    navigate("/login")
  }

  const isAuthenticated = !!user

  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
