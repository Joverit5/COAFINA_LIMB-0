// ==========================================
// FloatingNav.tsx - VERSIÓN ACTUALIZADA
// ==========================================
"use client";

import { useApp } from "@/contexts/AppContext";
import type { DashboardTab } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Barra flotante de navegación para el Dashboard
 * Permite cambiar entre "Datos Individuales", "Comparaciones" y "Análisis"
 */
export function FloatingNav() {
  const { dashboardTab, setDashboardTab } = useApp();

  const tabs: { value: DashboardTab; label: string; icon?: string }[] = [
    { value: "individual", label: "Datos Individuales" },
    { value: "comparison", label: "Comparaciones" },
    { value: "analysis", label: "Análisis LATAM" },
  ];

  return (
    <div className="fixed bottom-8 left-0 right-0 z-30 flex justify-center pointer-events-none px-4">
      <div
        className={cn(
          "inline-flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2",
          "bg-woodsmoke-950/90 backdrop-blur-md",
          "border-2 border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          "pointer-events-auto",
          "max-w-full w-full sm:w-auto"
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setDashboardTab(tab.value)}
            className={cn(
              "px-2 py-2 sm:px-5 sm:py-3 font-unbounded text-[9px] sm:text-xs font-medium uppercase tracking-wider",
              "transition-all duration-300",
              "flex items-center gap-1 sm:gap-2",
              "flex-1 sm:flex-initial justify-center",
              "min-w-0 overflow-hidden",
              dashboardTab === tab.value
                ? "bg-flamingo-400 text-woodsmoke-950 shadow-[4px_4px_0px_0px_rgba(255,107,157,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/5 border-2 border-transparent hover:border-white/10"
            )}
          >
            {tab.icon && <span className="text-base">{tab.icon}</span>}
            <span className="hidden sm:inline-block">{tab.label}</span>
            <span className="block sm:hidden overflow-hidden">
              <span className="inline-block whitespace-nowrap">
                <span className="inline-block animate-marquee">
                  {tab.label}&nbsp;&nbsp;&nbsp;{tab.label}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
