import { useState, useEffect, useCallback } from "react";

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string; // ISO date
  color: string;
  icon: string;
  createdAt: string;
}

export interface SavingsEntry {
  id: string;
  goalId: string;
  amount: number;
  date: string; // ISO date
  note?: string;
}

interface SavingsStore {
  goals: SavingsGoal[];
  entries: SavingsEntry[];
}

const STORAGE_KEY = "savings-tracker-data";

const GOAL_COLORS = [
  "savings-green",
  "savings-gold",
  "savings-coral",
  "savings-sky",
  "savings-violet",
];

const GOAL_ICONS = [
  "👗", "🎯", "🏍️", "🚲", "⌚", "👶", "👜", "💊", "📱",
  "🏠", "🚗", "✈️", "💻", "🎓", "💍", "🏖️", "🎸", "👟",
  "💄", "👠", "🧴", "💎", "🧳", "🎀", "🩺", "🏋️",
];

function loadStore(): SavingsStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { goals: [], entries: [] };
}

function saveStore(store: SavingsStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getColorForIndex(i: number) {
  return GOAL_COLORS[i % GOAL_COLORS.length];
}

export function getAvailableIcons() {
  return GOAL_ICONS;
}

export function calcDailyTarget(goal: SavingsGoal) {
  const remaining = goal.targetAmount - goal.savedAmount;
  if (remaining <= 0) return 0;
  const daysLeft = Math.max(1, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000));
  return remaining / daysLeft;
}

export function calcWeeklyTarget(goal: SavingsGoal) {
  const remaining = goal.targetAmount - goal.savedAmount;
  return Math.min(remaining, calcDailyTarget(goal) * 7);
}

export function calcMonthlyTarget(goal: SavingsGoal) {
  const remaining = goal.targetAmount - goal.savedAmount;
  return Math.min(remaining, calcDailyTarget(goal) * 30);
}

export function useSavingsStore() {
  const [store, setStore] = useState<SavingsStore>(loadStore);

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const addGoal = useCallback((goal: Omit<SavingsGoal, "id" | "savedAmount" | "createdAt" | "color">) => {
    setStore((prev) => {
      const newGoal: SavingsGoal = {
        ...goal,
        id: crypto.randomUUID(),
        savedAmount: 0,
        color: getColorForIndex(prev.goals.length),
        createdAt: new Date().toISOString(),
      };
      return { ...prev, goals: [...prev.goals, newGoal] };
    });
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setStore((prev) => ({
      goals: prev.goals.filter((g) => g.id !== goalId),
      entries: prev.entries.filter((e) => e.goalId !== goalId),
    }));
  }, []);

  const addEntry = useCallback((goalId: string, amount: number, note?: string) => {
    setStore((prev) => {
      const entry: SavingsEntry = {
        id: crypto.randomUUID(),
        goalId,
        amount,
        date: new Date().toISOString(),
        note,
      };
      const goals = prev.goals.map((g) =>
        g.id === goalId ? { ...g, savedAmount: g.savedAmount + amount } : g
      );
      return { goals, entries: [...prev.entries, entry] };
    });
  }, []);

  const totalSaved = store.goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const totalTarget = store.goals.reduce((sum, g) => sum + g.targetAmount, 0);

  return {
    goals: store.goals,
    entries: store.entries,
    addGoal,
    deleteGoal,
    addEntry,
    totalSaved,
    totalTarget,
  };
}
