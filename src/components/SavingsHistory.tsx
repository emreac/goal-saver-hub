import { SavingsEntry, SavingsGoal } from "@/hooks/useSavingsStore";
import { useCurrency } from "@/hooks/useCurrency";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface SavingsHistoryProps {
  entries: SavingsEntry[];
  goals: SavingsGoal[];
}

export function SavingsHistory({ entries, goals }: SavingsHistoryProps) {
  const { formatAmount } = useCurrency();
  const { t } = useLanguage();
  const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const goalMap = Object.fromEntries(goals.map((g) => [g.id, g]));

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 text-center">
        <p className="text-muted-foreground text-sm">{t("history.empty")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-display font-semibold text-base">{t("history.title")}</h3>
      </div>
      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {sorted.slice(0, 20).map((entry, i) => {
          const goal = goalMap[entry.goalId];
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 px-4 py-3"
            >
              <span className="text-xl">{goal?.icon || "💰"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{goal?.name || t("history.deleted")}</p>
                {entry.note && <p className="text-xs text-muted-foreground truncate">{entry.note}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-display font-semibold text-primary">+{formatAmount(entry.amount)}</p>
                <p className="text-[10px] text-muted-foreground">{format(new Date(entry.date), "MMM d")}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
