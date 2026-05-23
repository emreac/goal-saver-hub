import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sun, Moon, Smartphone, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useColorTheme } from "@/hooks/useColorTheme";
import { useCurrency, CURRENCIES } from "@/hooks/useCurrency";
import { useLanguage, LANGUAGES } from "@/hooks/useLanguage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage, t } = useLanguage();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("app-notifications") === "true";
  });

  const toggleNotifications = () => {
    const next = !notifications;
    setNotifications(next);
    localStorage.setItem("app-notifications", String(next));
  };

  const themeOptions = [
    { value: "light", label: t("settings.theme.light"), icon: Sun },
    { value: "dark", label: t("settings.theme.dark"), icon: Moon },
    { value: "system", label: t("settings.theme.system"), icon: Smartphone },
  ];

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => {
    if (confirm(t("settings.reset.confirm"))) {
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
          <span className="text-sm font-medium">{t("settings.theme")}</span>
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

      {/* Color Theme selector */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <span className="text-sm font-medium">App Color</span>
        </div>
        <div className="flex p-4 gap-3 justify-between items-center">
          {[
            { value: "default", bg: "bg-[#259c61]" },
            { value: "pink", bg: "bg-[#e84393]" },
            { value: "purple", bg: "bg-[#9b59b6]" },
            { value: "yellow", bg: "bg-[#f1c40f]" },
            { value: "blue", bg: "bg-[#3498db]" },
            { value: "aqua", bg: "bg-[#1abc9c]" },
          ].map((c) => (
            <button
              key={c.value}
              onClick={() => setColorTheme(c.value as any)}
              className={`w-8 h-8 rounded-full transition-transform ${c.bg} ${
                colorTheme === c.value ? "ring-2 ring-offset-2 ring-foreground scale-110" : "hover:scale-110"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Other settings */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
        <button
          onClick={() => setCurrencyOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/50"
        >
          <span className="text-sm font-medium">{t("settings.currency")}</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs">{currency.code} ({currency.symbol})</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
        <button
          onClick={() => setLanguageOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/50"
        >
          <span className="text-sm font-medium">{t("settings.language")}</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs">{language.flag} {language.nativeName}</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
        <div className="w-full flex items-center justify-between px-4 py-3.5">
          <span className="text-sm font-medium">{t("settings.notifications")}</span>
          <button
            onClick={toggleNotifications}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              notifications ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                notifications ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

      </div>

      {/* Danger zone */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/50 text-destructive"
        >
          <span className="text-sm font-medium">{t("settings.reset")}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground pt-4">{t("settings.version")}</p>

      {/* Currency picker */}
      <Dialog open={currencyOpen} onOpenChange={setCurrencyOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-5 pb-0">
            <DialogTitle className="font-display text-lg">{t("settings.currency.select")}</DialogTitle>
          </DialogHeader>
          <div className="px-4 py-3">
            <Input
              placeholder={t("settings.currency.search")}
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
                  {currency.code === c.code && <Check className="h-5 w-5 text-primary" />}
                </button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Language picker */}
      <Dialog open={languageOpen} onOpenChange={setLanguageOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-5 pb-3">
            <DialogTitle className="font-display text-lg">{t("settings.language.select")}</DialogTitle>
          </DialogHeader>
          <div className="divide-y divide-border">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang);
                  setLanguageOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <p className="text-sm font-medium">{lang.nativeName}</p>
                    <p className="text-xs text-muted-foreground">{lang.name}</p>
                  </div>
                </div>
                {language.code === lang.code && <Check className="h-5 w-5 text-primary" />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
