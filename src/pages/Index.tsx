import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, History, BarChart3 } from "lucide-react";
import { useSavingsStore } from "@/hooks/useSavingsStore";
import { MoneyJar } from "@/components/MoneyJar";
import { GoalCard } from "@/components/GoalCard";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import { SavingsHistory } from "@/components/SavingsHistory";
import { StatsOverview } from "@/components/StatsOverview";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

const Index = () => {
  const { goals, entries, addGoal, deleteGoal, addEntry, totalSaved, totalTarget } = useSavingsStore();
  const overallPct = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 pb-6">
        <div className="mx-auto max-w-lg px-5 pt-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl font-bold"
          >
            SaveJar 🫙
          </motion.h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your savings, visualized</p>

          {/* Hero jar */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mt-6"
          >
            <MoneyJar percentage={overallPct} color="savings-green" icon="💰" size="lg" />
            <div className="mt-2 text-center">
              <p className="font-display text-3xl font-bold">{formatCurrency(totalSaved)}</p>
              <p className="text-sm text-muted-foreground">
                of {formatCurrency(totalTarget)} total goals
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-lg px-5 -mt-1">
        <Tabs defaultValue="goals" className="w-full">
          <TabsList className="w-full rounded-xl bg-muted/80 p-1">
            <TabsTrigger value="goals" className="flex-1 gap-1.5 rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Target className="h-3.5 w-3.5" /> Goals
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 gap-1.5 rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <History className="h-3.5 w-3.5" /> History
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-1 gap-1.5 rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <BarChart3 className="h-3.5 w-3.5" /> Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="mt-4 space-y-4 pb-8">
            <div className="flex justify-end">
              <AddGoalDialog onAdd={addGoal} />
            </div>
            {goals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border-2 border-dashed border-border p-8 text-center"
              >
                <p className="text-4xl mb-3">🫙</p>
                <p className="font-display font-semibold">No goals yet</p>
                <p className="text-sm text-muted-foreground mt-1">Tap "New Goal" to start saving!</p>
              </motion.div>
            ) : (
              goals.map((goal, i) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onAddEntry={addEntry}
                  onDelete={deleteGoal}
                  index={i}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4 pb-8">
            <SavingsHistory entries={entries} goals={goals} />
          </TabsContent>

          <TabsContent value="stats" className="mt-4 pb-8">
            <StatsOverview entries={entries} goals={goals} totalSaved={totalSaved} totalTarget={totalTarget} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
