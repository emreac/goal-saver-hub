import { Home, BarChart3, Settings } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface BottomNavProps {
  active: string;
  onChange: (tab: string) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { t } = useLanguage();

  const tabs = [
    { id: "home", label: t("nav.home"), icon: Home },
    { id: "stats", label: t("nav.stats"), icon: BarChart3 },
    { id: "settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom bg-card/90 backdrop-blur-lg border-t border-border">
      <div className="mx-auto max-w-lg flex">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
              active === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
