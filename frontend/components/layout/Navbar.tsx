"use client";

import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

/**
 * Navbar flotante superior
 * Visible en todas las vistas de la aplicación
 */
export function Navbar() {
  const { viewMode, goToSelection, goToHome } = useApp();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        {/* Logo LIMB-O */}
        <button
          onClick={goToHome}
          className="group relative"
        >
          <h1 className="font-unbounded font-medium text-3xl text-white tracking-tight
                         transition-colors duration-300 group-hover:text-flamingo-400">
            LIMB-O
          </h1>
        </button>

        {/* Botón APP (visible solo en home) */}
        {viewMode === "home" && (
      <button
        onClick={goToSelection}
        className="group relative inline-flex items-center font-unbounded font-medium text-sm"
      >
        {/* Contenedor principal del botón */}
        <span
          className={cn(
            "relative z-10 px-6 py-3",
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
          EMPEZAR
        </span>
        
        {/* Ícono que sobresale */}
        <span
          className={cn(
            "relative z-10 px-4 py-3 -ml-2",
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
            className="w-5 h-5 text-black"
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
        )}
      </div>
    </nav>
  );
}
