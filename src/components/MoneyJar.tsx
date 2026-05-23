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
      <svg viewBox="0 0 80 110" width={w} height={h} className="drop-shadow-lg">
        {/* Wallet handles */}
        <path d="M28 35 C28 15 52 15 52 35" fill="none" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="4" />

        {/* Wallet body clip */}
        <defs>
          <clipPath id={`jar-clip-${color}`}>
            <path d="M15 35 Q10 35 8 45 L5 95 Q5 105 15 105 L65 105 Q75 105 75 95 L72 45 Q70 35 65 35 Z" />
          </clipPath>
        </defs>

        {/* Wallet background */}
        <path
          d="M15 35 Q10 35 8 45 L5 95 Q5 105 15 105 L65 105 Q75 105 75 95 L72 45 Q70 35 65 35 Z"
          fill="hsl(var(--jar-glass) / 0.4)"
          stroke="hsl(var(--jar-glass))"
          strokeWidth="1.5"
        />

        {/* Fill level */}
        <motion.rect
          clipPath={`url(#jar-clip-${color})`}
          x="0"
          width="80"
          y={105}
          height={0}
          fill={fillColor}
          opacity={0.6}
          initial={{ height: 0, y: 105 }}
          animate={{
            height: (clampedPct / 100) * 70,
            y: 105 - (clampedPct / 100) * 70,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Flap & Clasp */}
        <path 
          d="M25 35 L55 35 L52 55 Q40 62 28 55 Z" 
          fill="hsl(var(--jar-glass) / 0.6)" 
          stroke="hsl(var(--jar-glass))" 
          strokeWidth="1" 
        />
        <circle cx="40" cy="53" r="3" fill="hsl(var(--muted-foreground) / 0.6)" />
      </svg>

      {/* Icon */}
      <div className={`absolute bottom-6 ${iconSize}`}>{icon}</div>
    </div>
  );
}
