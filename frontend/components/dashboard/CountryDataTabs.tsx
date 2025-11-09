"use client";

import { useState } from "react";
import type { CountryDataTab } from "@/types";
import { cn } from "@/lib/utils";

interface CountryDataTabsProps {
  onTabChange?: (tab: CountryDataTab) => void;
  defaultTab?: CountryDataTab;
}

/**
 * Tabs de navegación de datos dentro de cada país
 * Permite cambiar entre diferentes tipos de métricas
 */
export function CountryDataTabs({ onTabChange, defaultTab = "tons" }: CountryDataTabsProps) {
  const [activeTab, setActiveTab] = useState<CountryDataTab>(defaultTab);

  const tabs: { value: CountryDataTab; label: string }[] = [
    { value: "tons", label: "Toneladas" },
    { value: "percapita", label: "Per Cápita" },
    { value: "collected", label: "Recolección Formal" },
    {value: "rate", label: "Tasa de Recolección" },
    { value: "recoverable", label: "Recuperable" },
    { value: "market", label: "Puesto en mercado" },
  ];

  const handleTabClick = (tab: CountryDataTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="border-b border-woodsmoke-700 mb-6">
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={cn(
              "px-4 py-2 font-sans text-sm font-medium whitespace-nowrap",
              "border-b-2 transition-all duration-200",
              activeTab === tab.value
                ? "border-flamingo-400 text-flamingo-400"
                : "border-transparent text-woodsmoke-400 hover:text-woodsmoke-200 hover:border-woodsmoke-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
