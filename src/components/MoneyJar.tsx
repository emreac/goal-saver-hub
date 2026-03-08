import { motion } from "framer-motion";

interface MoneyJarProps {
  percentage: number;
  color: string;
  icon: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { w: 56, h: 72 },
  md: { w: 80, h: 104 },
  lg: { w: 120, h: 156 },
};

const colorMap: Record<string, string> = {
  "savings-green": "hsl(153, 60%, 38%)",
  "savings-gold": "hsl(42, 90%, 55%)",
  "savings-coral": "hsl(12, 80%, 62%)",
  "savings-sky": "hsl(200, 75%, 55%)",
  "savings-violet": "hsl(265, 60%, 60%)",
};

export function MoneyJar({ percentage, color, icon, size = "md" }: MoneyJarProps) {
  const { w, h } = sizeMap[size];
  const fillColor = colorMap[color] || colorMap["savings-green"];
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const iconSize = size === "sm" ? "text-lg" : size === "lg" ? "text-4xl" : "text-2xl";

  return (
    <div className="relative flex flex-col items-center" style={{ width: w, height: h + 16 }}>
      {/* Jar SVG */}
      <svg viewBox="0 0 80 110" width={w} height={h} className="drop-shadow-lg">
        {/* Jar lid */}
        <rect x="22" y="2" width="36" height="10" rx="3" fill="hsl(var(--muted-foreground) / 0.3)" />
        <rect x="18" y="10" width="44" height="6" rx="2" fill="hsl(var(--muted-foreground) / 0.25)" />

        {/* Jar body clip */}
        <defs>
          <clipPath id={`jar-clip-${color}`}>
            <path d="M16 16 Q16 16 14 28 Q10 50 10 70 Q10 100 20 105 Q30 110 40 110 Q50 110 60 105 Q70 100 70 70 Q70 50 66 28 Q64 16 64 16 Z" />
          </clipPath>
        </defs>

        {/* Jar glass background */}
        <path
          d="M16 16 Q16 16 14 28 Q10 50 10 70 Q10 100 20 105 Q30 110 40 110 Q50 110 60 105 Q70 100 70 70 Q70 50 66 28 Q64 16 64 16 Z"
          fill="hsl(var(--jar-glass) / 0.4)"
          stroke="hsl(var(--jar-glass))"
          strokeWidth="1.5"
        />

        {/* Fill level */}
        <motion.rect
          clipPath={`url(#jar-clip-${color})`}
          x="8"
          width="64"
          y={110}
          height={0}
          fill={fillColor}
          opacity={0.6}
          initial={{ height: 0, y: 110 }}
          animate={{
            height: (clampedPct / 100) * 94,
            y: 110 - (clampedPct / 100) * 94,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Glass shine */}
        <ellipse cx="28" cy="55" rx="4" ry="18" fill="hsl(var(--jar-shine) / 0.25)" />
      </svg>

      {/* Icon */}
      <div className={`absolute bottom-6 ${iconSize}`}>{icon}</div>
    </div>
  );
}
