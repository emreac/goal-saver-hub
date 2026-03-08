import { useMemo } from "react";
import { SavingsEntry } from "@/hooks/useSavingsStore";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { startOfDay, subDays } from "date-fns";

interface StreakBarProps {
  entries: SavingsEntry[];
}

export function StreakBar({ entries }: StreakBarProps) {
  const { t } = useLanguage();

  const streak = useMemo(() => {
    if (entries.length === 0) return 0;
    let count = 0;
    let day = startOfDay(new Date());
    const hasTodayEntry = entries.some(
      (e) => startOfDay(new Date(e.date)).getTime() === day.getTime()
    );
    if (!hasTodayEntry) {
      day = subDays(day, 1);
      const hasYesterday = entries.some(
        (e) => startOfDay(new Date(e.date)).getTime() === day.getTime()
      );
      if (!hasYesterday) return 0;
    }
    while (true) {
      const hasEntry = entries.some(
        (e) => startOfDay(new Date(e.date)).getTime() === day.getTime()
      );
      if (!hasEntry) break;
      count++;
      day = subDays(day, 1);
    }
    return count;
  }, [entries]);

  const dots = Array.from({ length: 7 }, (_, i) => {
    const day = startOfDay(subDays(new Date(), 6 - i));
    const hasEntry = entries.some(
      (e) => startOfDay(new Date(e.date)).getTime() === day.getTime()
    );
    return hasEntry;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg px-5 pt-5 pb-1"
    >
      <div className="flex items-center justify-between rounded-2xl bg-card border border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-accent" />
          <span className="font-display font-bold text-lg">{streak}</span>
          <span className="text-xs text-muted-foreground">{t("streak.day")}</span>
        </div>
        <div className="flex gap-1.5">
          {dots.map((active, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full transition-colors ${
                active ? "bg-accent" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
