"use client";

import { useApp } from "@/contexts/AppContext";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Botón flotante para ir al dashboard
 * Solo visible cuando hay países seleccionados
 */
export function GoToDashboardButton() {
  const { selectedCountries, goToDashboard } = useApp();

  const isVisible = selectedCountries.length > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute bottom-8 right-8 z-40"
        >
          <button
            onClick={goToDashboard}
            className={cn(
              "group relative",
              "flex items-center gap-3",
              "px-8 py-4 font-sans font-medium text-base",
              "bg-woodsmoke-900/80 backdrop-blur-sm text-flamingo-400",
              "border-2 border-woodsmoke-700",
              "rounded-lg",
              "transition-all duration-200",
              "hover:bg-woodsmoke-800/80 hover:border-woodsmoke-600"
            )}
          >
            <span>Ir al Dashboard</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200
                                   group-hover:translate-x-1" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
