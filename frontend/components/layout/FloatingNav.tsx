"use client";

import { useApp } from "@/contexts/AppContext";
import type { DashboardTab } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Barra flotante de navegación para el Dashboard
 * Permite cambiar entre "Datos Individuales" y "Comparaciones"
 */
export function FloatingNav() {
  const { dashboardTab, setDashboardTab } = useApp();

  const tabs: { value: DashboardTab; label: string }[] = [
    { value: "individual", label: "Datos Individuales" },
    { value: "comparison", label: "Comparaciones" },
  ];

  return (
    <div className="fixed bottom-8 left-0 right-0 z-30 flex justify-center">
      <div
        className={cn(
          "inline-flex items-center gap-1 p-1.5",
          " backdrop-blur-md",
          "rounded-md",
          "shadow-lg"
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setDashboardTab(tab.value)}
            className={cn(
              "px-6 py-2.5 font-sans text-sm font-medium",
              "rounded-md transition-all duration-300",
              dashboardTab === tab.value
                ? "bg-flamingo-400 text-white shadow-md"
                : "text-woodsmoke-300 hover:text-white hover:bg-woodsmoke-800/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
