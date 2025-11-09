"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { ViewMode, DashboardTab, CountryData } from "@/types";

interface AppContextType {
  // Estado
  selectedCountries: string[];
  viewMode: ViewMode;
  dashboardTab: DashboardTab;
  countryData: Record<string, CountryData>;
  isGlobeInteractive: boolean;

  // Acciones
  toggleCountrySelection: (countryCode: string) => void;
  setSelectedCountries: (countries: string[]) => void;
  clearCountrySelection: () => void;
  setViewMode: (mode: ViewMode) => void;
  setDashboardTab: (tab: DashboardTab) => void;
  goToHome: () => void;
  goToSelection: () => void;
  goToDashboard: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Provider del estado global de la aplicación
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedCountries, setSelectedCountriesState] = useState<string[]>([]);
  const [viewMode, setViewModeState] = useState<ViewMode>("home");
  const [dashboardTab, setDashboardTabState] = useState<DashboardTab>("individual");
  // countryData se inicializa vacío: los componentes deben recuperar datos desde
  // la API usando las utilidades en `@/lib/mock-data`.
  const [countryData] = useState<Record<string, CountryData>>({});

  // El globo es interactivo solo en modo selection
  const isGlobeInteractive = viewMode === "selection";

  /**
   * Toggle selección de un país
   */
  const toggleCountrySelection = useCallback((countryCode: string) => {
    setSelectedCountriesState((prev) => {
      if (prev.includes(countryCode)) {
        return prev.filter((code) => code !== countryCode);
      } else {
        return [...prev, countryCode];
      }
    });
  }, []);

  /**
   * Establecer países seleccionados
   */
  const setSelectedCountries = useCallback((countries: string[]) => {
    setSelectedCountriesState(countries);
  }, []);

  /**
   * Limpiar selección de países
   */
  const clearCountrySelection = useCallback(() => {
    setSelectedCountriesState([]);
  }, []);

  /**
   * Cambiar modo de vista
   */
  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
  }, []);

  /**
   * Cambiar tab del dashboard
   */
  const setDashboardTab = useCallback((tab: DashboardTab) => {
    setDashboardTabState(tab);
  }, []);

  /**
   * Ir a la vista Home
   */
  const goToHome = useCallback(() => {
    setViewModeState("home");
  }, []);

  /**
   * Ir a la vista de Selección
   */
  const goToSelection = useCallback(() => {
    setViewModeState("selection");
  }, []);

  /**
   * Ir al Dashboard (solo si hay países seleccionados)
   */
  const goToDashboard = useCallback(() => {
    if (selectedCountries.length > 0) {
      setViewModeState("dashboard");
    }
  }, [selectedCountries.length]);

  const value: AppContextType = {
    selectedCountries,
    viewMode,
    dashboardTab,
    countryData,
    isGlobeInteractive,
    toggleCountrySelection,
    setSelectedCountries,
    clearCountrySelection,
    setViewMode,
    setDashboardTab,
    goToHome,
    goToSelection,
    goToDashboard,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook para acceder al contexto de la aplicación
 */
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp debe ser usado dentro de un AppProvider");
  }
  return context;
}
