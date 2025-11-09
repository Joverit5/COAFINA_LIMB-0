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
    <div className="fixed bottom-8 left-0 right-0 z-30 flex justify-center pointer-events-none">
      <div
        className={cn(
          "inline-flex items-center gap-2 p-2",
          "bg-woodsmoke-950/90 backdrop-blur-md",
          "border-2 border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          "pointer-events-auto"
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setDashboardTab(tab.value)}
            className={cn(
              "px-5 py-3 font-unbounded text-xs font-medium uppercase tracking-wider",
              "transition-all duration-300",
              "flex items-center gap-2",
              dashboardTab === tab.value
                ? "bg-flamingo-400 text-woodsmoke-950 shadow-[4px_4px_0px_0px_rgba(255,107,157,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/5 border-2 border-transparent hover:border-white/10"
            )}
          >
            {tab.icon && <span className="text-base">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
