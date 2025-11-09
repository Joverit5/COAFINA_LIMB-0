// ==========================================
// CRTFilter.tsx - Efecto CRT de Monitor Antiguo
// ==========================================
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CRTFilterProps {
  enabled?: boolean;
  intensity?: "light" | "medium" | "heavy";
}

/**
 * Filtro CRT que simula la matriz de píxeles RGB de monitores CRT
 * Efecto de puntos de fósforo rojo, verde y azul
 */
export function CRTFilter({ enabled = true, intensity = "medium" }: CRTFilterProps) {
  const [flicker, setFlicker] = useState(false);

  // Parpadeo sutil ocasional
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.97) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 30);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  const intensitySettings = {
    light: { opacity: 0.15, scale: 3 },
    medium: { opacity: 0.25, scale: 2.5 },
    heavy: { opacity: 0.4, scale: 2 },
  };

  const settings = intensitySettings[intensity];

  return (
    <>
      {/* Patrón de píxeles RGB (Dot Mask/Aperture Grille) */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-[9999]",
          "mix-blend-multiply",
          flicker && "opacity-70"
        )}
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, ${settings.opacity}) 0px,
              transparent 1px,
              transparent ${settings.scale}px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(255, 0, 0, ${settings.opacity * 0.8}) 0px,
              rgba(255, 0, 0, ${settings.opacity * 0.8}) 1px,
              rgba(0, 255, 0, ${settings.opacity * 0.8}) 1px,
              rgba(0, 255, 0, ${settings.opacity * 0.8}) 2px,
              rgba(0, 0, 255, ${settings.opacity * 0.8}) 2px,
              rgba(0, 0, 255, ${settings.opacity * 0.8}) 3px,
              transparent 3px,
              transparent ${settings.scale * 1.5}px
            )
          `,
          backgroundSize: `${settings.scale}px ${settings.scale}px`,
        }}
      />

      {/* Scanlines sutiles */}
      <div
        className="pointer-events-none fixed inset-0 z-[9998] opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.3) 0px,
              transparent 1px,
              transparent 2px
            )
          `,
        }}
      />

      {/* Curvatura y vignette de pantalla */}
      <div
        className="pointer-events-none fixed inset-0 z-[9997]"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 0%,
              transparent 70%,
              rgba(0, 0, 0, 0.4) 100%
            )
          `,
          boxShadow: `inset 0 0 150px rgba(0, 0, 0, 0.3)`,
        }}
      />

      {/* Brillo de pantalla */}
      <div
        className="pointer-events-none fixed inset-0 z-[9996] opacity-5"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              rgba(255, 255, 255, 0.3) 0%,
              transparent 60%
            )
          `,
        }}
      />
    </>
  );
}

// ==========================================
// Versión con Toggle para testing
// ==========================================
export function CRTFilterToggle() {
  const [enabled, setEnabled] = useState(true);
  const [intensity, setIntensity] = useState<"light" | "medium" | "heavy">("medium");

  return (
    <>
      <CRTFilter enabled={enabled} intensity={intensity} />
      
      {/* Controles flotantes */}
      <div className="fixed top-4 right-4 z-[10000] flex gap-2">
        <button
          onClick={() => setEnabled(!enabled)}
          className={cn(
            "px-4 py-2 font-mono text-xs backdrop-blur-sm border-2 transition-colors",
            enabled 
              ? "bg-flamingo-400 text-white border-flamingo-400" 
              : "bg-white/10 text-white/60 border-white/20"
          )}
        >
          CRT {enabled ? "ON" : "OFF"}
        </button>
        
        {enabled && (
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value as any)}
            className="px-3 py-2 font-mono text-xs bg-woodsmoke-950/90 text-white border-2 border-white/20 backdrop-blur-sm"
          >
            <option value="light">Sutil</option>
            <option value="medium">Medio</option>
            <option value="heavy">Intenso</option>
          </select>
        )}
      </div>
    </>
  );
}