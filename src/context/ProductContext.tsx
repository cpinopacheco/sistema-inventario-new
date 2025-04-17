"use client"

import { createContext, useState, useContext, type ReactNode, useCallback } from "react"
import toast from "react-hot-toast"
import { sampleProducts, sampleCategories } from "../data/sampleData"

// Definir tipos
export interface Product {
  id: number
  name: string
  description: string
  category: string
  stock: number
  minStock: number
  location: string
  price: number
  image?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
}

interface ProductContextType {
  products: Product[]
  categories: Category[]
  loading: boolean
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  updateProduct: (id: number, productData: Partial<Product>) => void
  deleteProduct: (id: number) => void
  getProduct: (id: number) => Product | undefined
  searchProducts: (query: string) => Product[]
  filterByCategory: (category: string) => Product[]
  getLowStockProducts: () => Product[]
  updateStock: (id: number, quantity: number) => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [categories] = useState<Category[]>(sampleCategories)
  const [loading] = useState(false)

  // Añadir un nuevo producto
  const addProduct = useCallback(
    (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
      const newProduct: Product = {
        ...product,
        id: Math.max(0, ...products.map((p) => p.id)) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setProducts((prev) => [...prev, newProduct])
      toast.success("Producto añadido correctamente")
    },
    [products],
  )

  // Actualizar un producto existente
  const updateProduct = useCallback((id: number, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              ...productData,
              updatedAt: new Date().toISOString(),
            }
          : product,
      ),
    )
    toast.success("Producto actualizado correctamente")
  }, [])

  // Eliminar un producto
  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
    toast.success("Producto eliminado correctamente")
  }, [])

  // Obtener un producto por su ID
  const getProduct = useCallback(
    (id: number) => {
      return products.find((product) => product.id === id)
    },
    [products],
  )

  // Buscar productos por nombre o descripción
  const searchProducts = useCallback(
    (query: string) => {
      if (!query.trim()) return products

      const lowercaseQuery = query.toLowerCase()
      return products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercaseQuery) ||
          product.description.toLowerCase().includes(lowercaseQuery),
      )
    },
    [products],
  )

  // Filtrar productos por categoría
  const filterByCategory = useCallback(
    (category: string) => {
      if (category === "all") return products
      return products.filter((product) => product.category === category)
    },
    [products],
  )

  // Obtener productos con stock bajo
  const getLowStockProducts = useCallback(() => {
    return products.filter((product) => product.stock <= product.minStock)
  }, [products])

  // Actualizar el stock de un producto
  const updateStock = useCallback((id: number, quantity: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              stock: product.stock + quantity,
              updatedAt: new Date().toISOString(),
            }
          : product,
      ),
    )
  }, [])

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        searchProducts,
        filterByCategory,
        getLowStockProducts,
        updateStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

// Hook personalizado
export const useProducts = () => {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts debe usarse dentro de un ProductProvider")
  }
  return context
}
