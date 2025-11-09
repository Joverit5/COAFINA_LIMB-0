"use client";

import { useEffect, useRef } from "react";
import type { EWasteStats } from "@/types";
import { formatKilotons, formatPercentage, formatUSD } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface CountryMetricsProps {
  data: EWasteStats;
  className?: string;
  animate?: boolean;
}

/**
 * Componente individual de métrica con animación
 */
function AnimatedMetric({
  label,
  value,
  highlight,
  delay = 0,
  animate = true,
}: {
  label: string;
  value: string;
  highlight: boolean;
  delay?: number;
  animate?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || !containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: 10,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay,
        ease: "power2.out",
      }
    );
  }, [delay, animate]);

  return (
    <div ref={containerRef} className="flex flex-col gap-1 opacity-0">
      <span className="text-xs font-sans text-white/60 uppercase tracking-wide">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-sm font-medium",
          highlight ? "text-flamingo-400" : "text-white"
        )}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Métricas clave de e-waste (basadas en API /ewaste/stats)
 * Se muestran en el header del collapsible con estilo Nothing Phone
 */
export function CountryMetrics({ data, className, animate = true }: CountryMetricsProps) {
  const metrics = [
    {
      label: "Generado",
      value: `${formatKilotons(data.e_waste_generated_kt)} t`,
      highlight: true,
      delay: 0.1,
    },
    {
      label: "Per Cápita",
      value: `${data.e_waste_generated_per_capita.toFixed(1)} KG`,
      highlight: true,
      delay: 0.2,
    },
    {
      label: "Tasa Recolección",
      value: formatPercentage(data.e_waste_collection_rate),
      highlight: false,
      delay: 0.3,
    },
    {
      label: "Valor Recuperable",
      value: formatUSD(data.value_recoverable_usd),
      highlight: false,
      delay: 0.4,
    },
  ];

  return (
    <div className={cn("flex items-center gap-6 flex-wrap", className)}>
      {metrics.map((metric, index) => (
        <AnimatedMetric
          key={index}
          label={metric.label}
          value={metric.value}
          highlight={metric.highlight}
          delay={metric.delay}
          animate={animate}
        />
      ))}
    </div>
  );
}
