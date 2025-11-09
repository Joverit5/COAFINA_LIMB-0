"use client";

import { useEffect } from "react";
import type { GlobeControllerProps } from "@/types";

/**
 * Componente para controlar la cámara y rotación del globo
 * Maneja la interactividad y animaciones automáticas
 */
export function GlobeController({
  globeRef,
  isInteractive,
  autoRotate = true,
  autoRotateSpeed = 0.3,
  initialView = { lat: -10, lng: -60, altitude: 1.8 },
}: GlobeControllerProps) {

  // Evita re-aplicar el punto de vista inicial en cada cambio de props.
  // Queremos que el globo continúe girando desde su posición actual cuando
  // el usuario hace selecciones; sólo aplicamos el pointOfView una vez al
  // inicializar el componente.
  const initializedRef = (globalThis as any).__globe_initialised_ref__ ||= { current: false };

  // Configurar rotación automática y punto de vista inicial
  useEffect(() => {
    if (!globeRef.current) return;

    const globe = globeRef.current;
    const controls = globe.controls();

    if (controls) {
      // Siempre con rotación automática
      controls.autoRotate = true;
      controls.autoRotateSpeed = autoRotateSpeed;

      // Configurar controles de interacción
      if (isInteractive) {
        controls.enableZoom = true;
        controls.enableRotate = true;
        controls.enablePan = false;
        controls.minDistance = 150;
        controls.maxDistance = 500;
      } else {
        controls.enableZoom = false;
        controls.enableRotate = false;
        controls.enablePan = false;
      }
    }

    // Establecer punto de vista inicial más cercano sólo la primera vez.
    if (!initializedRef.current) {
      try {
        globe.pointOfView(initialView, 0);
      } catch (e) {
        // Ignorar si pointOfView no está disponible todavía
      }
      initializedRef.current = true;
    }
  }, [globeRef, isInteractive, autoRotateSpeed, initialView]);

  // Actualizar cuando cambia el modo interactivo
  useEffect(() => {
    if (!globeRef.current) return;

    const globe = globeRef.current;
    const controls = globe.controls();

    if (controls) {
      // Siempre rotando
      controls.autoRotate = true;

      if (isInteractive) {
        controls.enableZoom = true;
        controls.enableRotate = true;
      } else {
        controls.enableZoom = false;
        controls.enableRotate = false;
      }
    }
  }, [globeRef, isInteractive]);

  // Este componente no renderiza nada, solo controla el globo
  return null;
}
