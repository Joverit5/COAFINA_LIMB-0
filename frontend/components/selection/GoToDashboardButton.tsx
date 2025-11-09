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
            className="group relative inline-flex items-center font-unbounded font-medium text-xs md:text-sm"
          >
            {/* Contenedor principal del botón */}
            <span
              className={cn(
                "relative z-10 px-4 py-2 md:px-6 md:py-3",
                "bg-white text-woodsmoke-950",
                "border-2 border-woodsmoke-950",
                "shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]",
                "transition-all duration-200",
                "group-hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]",
                "group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]",
                "group-active:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]",
                "group-active:translate-x-[2px] group-active:translate-y-[2px]"
              )}
            >
              IR AL DASHBOARD
            </span>

            {/* Ícono que sobresale */}
            <span
              className={cn(
                "relative z-10 px-2 py-2 md:px-3 md:py-3 -ml-2",
                "bg-flamingo-400",
                "border-2 border-woodsmoke-950 border-l-0",
                "shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]",
                "transition-all duration-200",
                "group-hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] ",
                "group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] ",
                "group-active:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]",
                "group-active:translate-x-[2px] group-active:translate-y-[2px] "
              )}
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
