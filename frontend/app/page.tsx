"use client";

import { AppProvider, useApp } from "@/contexts/AppContext";
import { Globe3D } from "@/components/globe";
import { Navbar } from "@/components/layout";
import { HeroSection } from "@/components/home";
import { SelectionView } from "@/components/selection";
import { DashboardView } from "@/components/dashboard";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Componente interno que usa el contexto
 */
function AppContent() {
  const { viewMode, isGlobeInteractive, selectedCountries, toggleCountrySelection } = useApp();

  return (
    <div className="relative w-full min-h-screen bg-woodsmoke-950 overflow-hidden">
      {/* Globo 3D de fondo - siempre visible */}
      <div className="fixed inset-0 z-0">
        <Globe3D
          isInteractive={isGlobeInteractive}
          selectedCountries={selectedCountries}
          onCountryClick={toggleCountrySelection}
        />
      </div>

      {/* Navbar - siempre visible */}
      <Navbar />

      {/* Contenido que cambia según viewMode */}
      <AnimatePresence mode="wait">
        {viewMode === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection />
          </motion.div>
        )}

        {viewMode === "selection" && (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SelectionView />
          </motion.div>
        )}

        {viewMode === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Página principal de LIMB-O
 * Single-page application con navegación por estado
 */
export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
