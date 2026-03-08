import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { MoneyJar } from "./MoneyJar";
import { AddSavingsDialog } from "./AddSavingsDialog";
import { SavingsGoal, calcDailyTarget, calcWeeklyTarget, calcMonthlyTarget } from "@/hooks/useSavingsStore";
import { useCurrency } from "@/hooks/useCurrency";
import { useLanguage } from "@/hooks/useLanguage";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface GoalCardProps {
  goal: SavingsGoal;
  onAddEntry: (goalId: string, amount: number, note?: string) => void;
  onDelete: (goalId: string) => void;
  index: number;
}

export function GoalCard({ goal, onAddEntry, onDelete, index }: GoalCardProps) {
  const { formatAmount } = useCurrency();
  const { t } = useLanguage();
  const pct = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
  const daily = calcDailyTarget(goal);
  const weekly = calcWeeklyTarget(goal);
  const monthly = calcMonthlyTarget(goal);
  const isComplete = pct >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative rounded-2xl bg-card border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 h-7 w-7 text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(goal.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="flex items-start gap-4">
        <MoneyJar percentage={pct} color={goal.color} icon={goal.icon} size="sm" />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-base truncate pr-6">{goal.name}</h3>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-xl font-bold">{formatAmount(goal.savedAmount)}</span>
            <span className="text-sm text-muted-foreground">/ {formatAmount(goal.targetAmount)}</span>
          </div>
          <Progress value={Math.min(100, pct)} className="mt-2 h-2" />

          {isComplete ? (
            <p className="mt-2 text-sm font-medium text-primary">{t("goals.reached")}</p>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                { label: t("goals.daily"), value: daily },
                { label: t("goals.weekly"), value: weekly },
                { label: t("goals.monthly"), value: monthly },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-muted/60 py-1.5 px-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="font-display text-sm font-semibold">{formatAmount(value)}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3">
            <AddSavingsDialog goalName={goal.name} onAdd={(amt, note) => onAddEntry(goal.id, amt, note)} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
