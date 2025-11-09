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
          <h1 className="font-unbounded font-medium text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white tracking-tight transition-colors duration-300 group-hover:text-flamingo-400">
            LIMB-O
          </h1>
        </button>

        {/* Botón APP (visible solo en home) */}
        {viewMode === "home" && (
      <div className="group relative">
        <button
          onClick={goToSelection}
          className="relative inline-flex items-center font-unbounded font-medium text-sm"
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
              "group-hover:-translate-x-0.5 group-hover:-translate-y-0.5",
              "group-active:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]",
              "group-active:translate-x-0.5 group-active:translate-y-0.5",
              "h-11"
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
              "group-hover:-translate-x-0.5 group-hover:-translate-y-0.5",
              "group-active:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]",
              "group-active:translate-x-0.5 group-active:translate-y-0.5",
              "h-11"
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

        {/* Créditos con animación */}
        <div className="absolute right-0 top-full pt-2 w-72 overflow-hidden">
          <div className={cn(
            "flex flex-col gap-1 bg-woodsmoke-950/90 backdrop-blur-sm p-4 rounded-md border border-white/10",
            "opacity-0 -translate-y-2.5 group-hover:opacity-100 group-hover:translate-y-0",
            "transition-all duration-300 ease-out"
          )}>
            {[
              "Este proyecto fue desarrollado por:",
              "Isabella Sofía Arrieta Guardo",
              "José Fernando González Ortiz",
              "Fabián Camilo Quintero Pareja",
              "Santiago Quintero Pareja",
              "Eduardo Alejandro Negrín Pérez"
            ].map((text, index) => (
              <p 
                key={index}
                className={cn(
                  "font-sans text-sm text-woodsmoke-400 leading-relaxed",
                  index === 0 && "text-white mb-2",
                  "transform transition-all duration-500",
                  "opacity-0 -translate-y-2.5 group-hover:opacity-100 group-hover:translate-y-0"
                )}
                style={{
                  transitionDelay: `${150 + index * 50}ms`,
                  animationDelay: `${index * 50}ms`
                }}
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
        )}
      </div>
    </nav>
  );
}
