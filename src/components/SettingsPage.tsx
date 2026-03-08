import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export function SettingsPage() {
  const items = [
    { label: "Currency", value: "USD ($)" },
    { label: "Theme", value: "System" },
    { label: "Notifications", value: "Off" },
    { label: "Export Data", value: "" },
    { label: "Reset All Data", value: "", danger: true },
  ];

  const handleReset = () => {
    if (confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      localStorage.removeItem("savings-tracker-data");
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.label === "Reset All Data" ? handleReset : undefined}
            className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/50 ${
              item.danger ? "text-destructive" : ""
            }`}
          >
            <span className="text-sm font-medium">{item.label}</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              {item.value && <span className="text-xs">{item.value}</span>}
              <ChevronRight className="h-4 w-4" />
            </div>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground pt-4">SaveJar v1.0</p>
    </motion.div>
  );
}
