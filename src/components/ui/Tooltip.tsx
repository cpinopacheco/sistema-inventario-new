"use client"

import { useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TooltipProps {
  children: ReactNode
  content: string
  position?: "top" | "bottom" | "left" | "right"
}

export const Tooltip = ({ children, content, position = "top" }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const showTooltip = () => setIsVisible(true)
  const hideTooltip = () => setIsVisible(false)

  // Posicionamiento del tooltip
  const getPosition = () => {
    switch (position) {
      case "right":
        return "left-full ml-2 top-1/2 -translate-y-1/2"
      case "left":
        return "right-full mr-2 top-1/2 -translate-y-1/2"
      case "bottom":
        return "top-full mt-2 left-1/2 -translate-x-1/2"
      default: // top
        return "bottom-full mb-2 left-1/2 -translate-x-1/2"
    }
  }

  return (
    <div className="relative inline-block" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 whitespace-nowrap px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded shadow ${getPosition()}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
