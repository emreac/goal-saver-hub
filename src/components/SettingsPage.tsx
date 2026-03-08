import { motion } from "framer-motion";
import { ChevronRight, Sun, Moon, Smartphone } from "lucide-react";
import { useTheme } from "next-themes";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Smartphone },
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
      {/* App logo & branding */}
      <div className="flex flex-col items-center py-4">
        <img src="/app-icon.png" alt="SaveJar" className="h-20 w-20 rounded-2xl shadow-lg" />
        <h2 className="font-display text-lg font-bold mt-3">SaveJar</h2>
        <p className="text-xs text-muted-foreground">Your savings, visualized</p>
      </div>

      {/* Theme selector */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <span className="text-sm font-medium">Theme</span>
        </div>
        <div className="flex p-2 gap-2">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-colors ${
                theme === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Other settings */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
        {[
          { label: "Currency", value: "USD ($)" },
          { label: "Notifications", value: "Off" },
          { label: "Export Data", value: "" },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/50"
          >
            <span className="text-sm font-medium">{item.label}</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              {item.value && <span className="text-xs">{item.value}</span>}
              <ChevronRight className="h-4 w-4" />
            </div>
          </button>
        ))}
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/50 text-destructive"
        >
          <span className="text-sm font-medium">Reset All Data</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground pt-4">SaveJar v1.0</p>
    </motion.div>
  );
}
