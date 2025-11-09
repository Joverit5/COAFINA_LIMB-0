"use client";

import React, { useMemo, useState } from "react";

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
    <div className="w-full" style={{ maxWidth: width }}>
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
            <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} onMouseEnter={() => setHover({x:p.x,y:p.y,index:i})} onMouseLeave={() => setHover(null)} />
          ) : null
        ))}

        {/* hover tooltip */}
        {hover && (() => {
          const idx = hover.index;
          const d = data[idx];
          const tooltipX = Math.min(Math.max(hover.x + 6, padding), width - padding - 140);
          const tooltipY = Math.max(hover.y - 36, padding);
          return (
            <g>
              <rect x={tooltipX} y={tooltipY} width={140} height={48} rx={6} fill="#0f1724" stroke="#111827" />
              <text x={tooltipX + 8} y={tooltipY + 18} fill="#fff" fontSize={12} fontFamily="Inter, Arial">
                {`Año: ${d.x}`}
              </text>
              <text x={tooltipX + 8} y={tooltipY + 36} fill="#fff" fontSize={12} fontFamily="Inter, Arial">
                {`${country ?? ""} — ${yLabel ?? "value"}: ${d.y == null ? "N/A" : Number(d.y).toLocaleString('es-ES')}`}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

export default LineChart;
