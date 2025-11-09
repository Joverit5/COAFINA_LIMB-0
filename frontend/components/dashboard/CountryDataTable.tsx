"use client";

import { useEffect, useRef } from "react";
import type { EWasteStats } from "@/types";
import { formatKilotons, formatPercentage, formatUSD } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import gsap from "gsap";

interface CountryDataTableProps {
  data: EWasteStats;
}

/**
 * Tabla de datos del país (basada en API /ewaste/stats)
 * Muestra estadísticas reales de e-waste con estilo Nothing Phone
 */
export function CountryDataTable({ data }: CountryDataTableProps) {
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  const tableData = [
    {
      metric: "E-Waste Generado",
      value: `${formatKilotons(data.e_waste_generated_kt)} toneladas`,
      rawValue: data.e_waste_generated_kt,
      unit: "kt",
    },
    {
      metric: "E-Waste Per Cápita",
      value: `${data.e_waste_generated_per_capita.toFixed(1)} KG/hab`,
      rawValue: data.e_waste_generated_per_capita,
      unit: "kg/hab",
    },
    {
      metric: "Tasa de Recolección",
      value: formatPercentage(data.e_waste_collection_rate),
      rawValue: data.e_waste_collection_rate,
      unit: "%",
    },
    {
      metric: "E-Waste Recolectado Formalmente",
      value: `${formatKilotons(data.e_waste_formally_collected_kt)} toneladas`,
      rawValue: data.e_waste_formally_collected_kt,
      unit: "kt",
    },
    {
      metric: "Valor Recuperable",
      value: formatUSD(data.value_recoverable_usd),
      rawValue: data.value_recoverable_usd,
      unit: "USD",
    },
    {
      metric: "Año de Reporte",
      value: data.year.toString(),
      rawValue: data.year,
      unit: "",
    },
  ];

  // Animación de entrada de las filas
  useEffect(() => {
    if (!tableBodyRef.current) return;

    const rows = tableBodyRef.current.querySelectorAll("tr");

    gsap.fromTo(
      rows,
      {
        opacity: 0,
        x: -20,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.2,
      }
    );
  }, [data.country]); // Re-animar cuando cambia el país

  return (
    <div className="rounded-none border-2 border-white/10 overflow-hidden bg-woodsmoke-950/40">
      <Table>
        <TableHeader>
          <TableRow className="bg-transparent hover:bg-transparent border-b-2 border-white/10">
            <TableHead className="font-unbounded text-xs text-white uppercase tracking-wider">
              Métrica
            </TableHead>
            <TableHead className="font-unbounded text-xs text-white uppercase tracking-wider text-right">
              Valor
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody ref={tableBodyRef}>
          {tableData.map((row, index) => (
            <TableRow
              key={index}
              className="border-b border-white/5 hover:bg-white/5 transition-colors opacity-0"
            >
              <TableCell className="font-sans text-sm text-white/80 py-4">
                {row.metric}
              </TableCell>
              <TableCell className="font-mono text-sm text-flamingo-400 font-medium text-right py-4">
                {row.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Nota sobre la API */}
      <div className="px-4 py-3 border-t border-white/5 bg-woodsmoke-950/60">
        <p className="text-xs text-white/40 font-mono">
          Fuente: API /ewaste/stats • Año {data.year}
        </p>
      </div>
    </div>
  );
}
