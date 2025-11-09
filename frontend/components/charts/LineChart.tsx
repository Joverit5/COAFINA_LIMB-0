"use client";

import React, { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Point {
  x: number | string; // year
  y: number | null | undefined;
}

interface LineChartProps {
  data: Point[]; // ordered by x (year)
  color?: string; // tailwind color or hex
  strokeWidth?: number;
  height?: number;
  width?: number;
  yLabel?: string;
  country?: string;
}

export function LineChart({ data, color = "#fb7185", strokeWidth = 2, height = 160, width = 600, yLabel, country }: LineChartProps) {
  const [hover, setHover] = useState<{x:number,y:number,index:number}|null>(null);

  const padding = 24;
  const points = useMemo(() => {
    const ys = data.map((d) => (d.y == null || Number.isNaN(d.y) ? null : Number(d.y)));
    const xs = data.map((d) => Number(d.x));
    const minY = Math.min(...ys.filter((v): v is number => v !== null), 0);
    const maxY = Math.max(...ys.filter((v): v is number => v !== null), 1);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const scaleX = (x: number) => {
      if (maxX === minX) return padding;
      return padding + ((x - minX) / (maxX - minX)) * (width - padding * 2);
    };
    const scaleY = (y: number) => {
      if (maxY === minY) return height - padding;
      return height - padding - ((y - minY) / (maxY - minY)) * (height - padding * 2);
    };
    const pts: Array<{x:number,y:number,rawY:number|null}> = [];
    for (let i = 0; i < data.length; i++) {
      const xv = Number(data[i].x);
      const yv = ys[i];
      if (yv === null) {
        pts.push({ x: scaleX(xv), y: NaN, rawY: null });
      } else {
        pts.push({ x: scaleX(xv), y: scaleY(yv), rawY: yv });
      }
    }
    return { pts, minY, maxY, minX, maxX };
  }, [data, height, width]);

  const pathD = useMemo(() => {
    const { pts } = points;
    let d = "";
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (isNaN(p.y)) {
        // break path
        continue;
      }
      if (d === "") d = `M ${p.x} ${p.y}`;
      else d += ` L ${p.x} ${p.y}`;
    }
    return d;
  }, [points]);

  return (
    <div className="w-full relative" style={{ maxWidth: width }}>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="border border-woodsmoke-900 rounded-md bg-woodsmoke-950">
        {/* grid lines */}
        <g stroke="#2b2b2b" strokeWidth={0.5}>
          <line x1={padding} x2={width - padding} y1={padding} y2={padding} opacity={0.15} />
          <line x1={padding} x2={width - padding} y1={height/2} y2={height/2} opacity={0.08} />
          <line x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} opacity={0.15} />
        </g>

        {/* path */}
        <path d={pathD} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />

        {/* points */}
        {points.pts.map((p, i) => (
          !isNaN(p.y) ? (
            <circle 
              key={i} 
              cx={p.x} 
              cy={p.y} 
              r={hover?.index === i ? 5 : 3} 
              fill={color} 
              className="transition-all duration-200"
              onMouseEnter={() => setHover({x:p.x,y:p.y,index:i})} 
              onMouseLeave={() => setHover(null)} 
            />
          ) : null
        ))}
      </svg>

      {/* Custom Tooltip */}
      {hover && (
        <div 
          style={{
            position: 'absolute',
            left: `${hover.x}px`,
            top: `${hover.y}px`,
            transform: `translate(-50%, ${hover.index === 0 ? 20 : -100}%)`,
            marginTop: hover.index === 0 ? '10px' : '-10px',
          }}
          className="pointer-events-none z-50"
        >
          <div className="rounded-none border-2 border-white/10 overflow-hidden bg-woodsmoke-950/40 backdrop-blur-sm shadow-2xl min-w-48">
            <Table>
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b-2 border-white/10">
                  <TableHead className="font-unbounded text-xs text-white uppercase tracking-wider px-4 py-2">
                    {country || "País"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-sans text-sm text-white/80 px-4 py-2">
                    Año
                  </TableCell>
                  <TableCell className="font-mono text-sm text-flamingo-400 font-medium text-right px-4 py-2">
                    {data[hover.index].x}
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-sans text-sm text-white/80 px-4 py-2">
                    {yLabel || "Valor"}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-flamingo-400 font-medium text-right px-4 py-2">
                    {data[hover.index].y === null 
                      ? "N/A" 
                      : Number(data[hover.index].y).toLocaleString('es-ES', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 0
                        })
                    }
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="px-4 py-2 border-t border-white/5 bg-woodsmoke-950/60">
              <p className="text-xs text-white/40 font-mono">
                Fuente: API /ewaste/time_series_full
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LineChart;
