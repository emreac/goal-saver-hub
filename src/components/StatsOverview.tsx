import { SavingsEntry, SavingsGoal } from "@/hooks/useSavingsStore";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { format, subDays, startOfDay } from "date-fns";

interface StatsOverviewProps {
  entries: SavingsEntry[];
  goals: SavingsGoal[];
  totalSaved: number;
  totalTarget: number;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export function StatsOverview({ entries, totalSaved, totalTarget }: StatsOverviewProps) {
  // Last 7 days chart data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const day = startOfDay(subDays(new Date(), 6 - i));
    const dayEnd = new Date(day.getTime() + 86400000);
    const total = entries
      .filter((e) => {
        const d = new Date(e.date);
        return d >= day && d < dayEnd;
      })
      .reduce((s, e) => s + e.amount, 0);
    return { day: format(day, "EEE"), amount: total };
  });

  const thisMonthTotal = entries
    .filter((e) => {
      const d = new Date(e.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Saved</p>
          <p className="font-display text-2xl font-bold mt-1">{formatCurrency(totalSaved)}</p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">This Month</p>
          <p className="font-display text-2xl font-bold mt-1">{formatCurrency(thisMonthTotal)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl bg-card border border-border p-4">
        <h3 className="font-display font-semibold text-sm mb-3">Last 7 Days</h3>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7} barCategoryGap="25%">
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis hide />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Saved"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
