import * as React from "react";
import { cn } from "@/frontend/lib/utils";

// 1. ATS Score Donut Gauge
export interface ScoreGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number; // 0 to 100
  size?: "sm" | "default" | "lg";
  label?: string;
  sublabel?: string;
}

const ScoreGauge = React.forwardRef<HTMLDivElement, ScoreGaugeProps>(
  (
    {
      className,
      score = 0,
      size = "default",
      label = "ATS Score",
      sublabel,
      ...props
    },
    ref
  ) => {
    const safeScore = Math.min(100, Math.max(0, score));

    const dimensions = {
      sm: { radius: 30, stroke: 6, width: 72, fontSize: "text-base" },
      default: { radius: 45, stroke: 8, width: 110, fontSize: "text-2xl" },
      lg: { radius: 60, stroke: 10, width: 148, fontSize: "text-3xl" },
    };

    const { radius, stroke, width, fontSize } = dimensions[size];
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (safeScore / 100) * circumference;

    const getColor = (s: number) => {
      if (s >= 80) return "text-emerald-600 stroke-emerald-600";
      if (s >= 60) return "text-blue-600 stroke-blue-600";
      if (s >= 40) return "text-amber-500 stroke-amber-500";
      return "text-red-500 stroke-red-500";
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center text-center", className)}
        {...props}
      >
        <div className="relative flex items-center justify-center" style={{ width, height: width }}>
          <svg className="size-full -rotate-90" viewBox={`0 0 ${width} ${width}`}>
            {/* Background track */}
            <circle
              cx={width / 2}
              cy={width / 2}
              r={radius}
              fill="transparent"
              strokeWidth={stroke}
              className="stroke-neutral-200"
            />
            {/* Animated progress ring */}
            <circle
              cx={width / 2}
              cy={width / 2}
              r={radius}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={cn("transition-all duration-1000 ease-out", getColor(safeScore))}
            />
          </svg>

          {/* Value text in center */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className={cn("font-bold text-neutral-900 tracking-tight", fontSize)}>
              {safeScore}%
            </span>
          </div>
        </div>

        {label && (
          <span className="mt-2 text-xs font-semibold text-neutral-800">{label}</span>
        )}
        {sublabel && (
          <span className="text-[11px] text-neutral-500">{sublabel}</span>
        )}
      </div>
    );
  }
);
ScoreGauge.displayName = "ScoreGauge";

// 2. Bar Meter for Section Completeness
export interface BarMeterItem {
  label: string;
  value: number; // 0 to 100
  color?: "indigo" | "emerald" | "amber" | "rose" | "blue" | "purple";
}

export interface BarMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  items: BarMeterItem[];
}

const BarMeter = React.forwardRef<HTMLDivElement, BarMeterProps>(
  ({ className, items, ...props }, ref) => {
    const colorClasses = {
      indigo: "bg-neutral-900",
      emerald: "bg-emerald-600",
      amber: "bg-amber-500",
      rose: "bg-red-500",
      blue: "bg-blue-600",
      purple: "bg-slate-700",
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-2.5 w-full", className)} {...props}>
        {items.map((item, idx) => {
          const safeVal = Math.min(100, Math.max(0, item.value));
          const colorClass = colorClasses[item.color || "indigo"];

          return (
            <div key={idx} className="flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-700">{item.label}</span>
                <span className="font-mono text-[11px] text-neutral-400">{safeVal}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", colorClass)}
                  style={{ width: `${safeVal}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);
BarMeter.displayName = "BarMeter";

// 3. Mini Sparkline Chart
export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  showFill?: boolean;
}

const Sparkline = React.forwardRef<SVGSVGElement, SparklineProps>(
  (
    {
      className,
      data,
      color = "#18181b",
      height = 36,
      width = 120,
      showFill = true,
      ...props
    },
    ref
  ) => {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return { x, y };
    });

    const pathD = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, "");

    const fillD = `${pathD} L ${width},${height} L 0,${height} Z`;

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={cn("overflow-visible", className)}
        {...props}
      >
        <defs>
          <linearGradient id={`sparkline-grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {showFill && (
          <path
            d={fillD}
            fill={`url(#sparkline-grad-${color.replace("#", "")})`}
          />
        )}

        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);
Sparkline.displayName = "Sparkline";

export { ScoreGauge, BarMeter, Sparkline };
