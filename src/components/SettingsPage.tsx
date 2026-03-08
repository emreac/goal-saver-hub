import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sun, Moon, Smartphone, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useCurrency, CURRENCIES } from "@/hooks/useCurrency";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [search, setSearch] = useState("");

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Smartphone },
  ];

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

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
        <button
          onClick={() => setCurrencyOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/50"
        >
          <span className="text-sm font-medium">Currency</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs">{currency.code} ({currency.symbol})</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
        <button className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/50">
          <span className="text-sm font-medium">Notifications</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs">Off</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
        <button className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/50">
          <span className="text-sm font-medium">Export Data</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
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

      {/* Currency picker dialog */}
      <Dialog open={currencyOpen} onOpenChange={setCurrencyOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-5 pb-0">
            <DialogTitle className="font-display text-lg">Select Currency</DialogTitle>
          </DialogHeader>
          <div className="px-4 py-3">
            <Input
              placeholder="Search currencies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <ScrollArea className="max-h-72">
            <div className="divide-y divide-border">
              {filtered.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c);
                    setCurrencyOpen(false);
                    setSearch("");
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium w-8">{c.symbol}</span>
                    <div>
                      <p className="text-sm font-medium">{c.code}</p>
                      <p className="text-xs text-muted-foreground">{c.name}</p>
                    </div>
                  </div>
                  {currency.code === c.code && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
