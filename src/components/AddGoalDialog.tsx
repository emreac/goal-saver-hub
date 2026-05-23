import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { getAvailableIcons } from "@/hooks/useSavingsStore";
import { useLanguage } from "@/hooks/useLanguage";

interface AddGoalDialogProps {
  onAdd: (goal: { name: string; targetAmount: number; deadline: string; icon: string }) => void;
}

export function AddGoalDialog({ onAdd }: AddGoalDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [icon, setIcon] = useState("🏠");
  const icons = getAvailableIcons();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target || !deadline) return;
    onAdd({ name, targetAmount: parseFloat(target), deadline, icon });
    setName("");
    setTarget("");
    setDeadline("");
    setIcon("🏠");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow">
          <Plus className="h-5 w-5" />
          {t("goals.new")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{t("dialog.create.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label>{t("dialog.create.name")}</Label>
            <Input placeholder={t("dialog.create.name.placeholder")} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("dialog.create.target")}</Label>
            <Input type="number" min="1" step="0.01" placeholder="1000" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("dialog.create.date")}</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("dialog.create.icon")}</Label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto rounded-lg p-1">
              {icons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`text-xl p-1.5 rounded-lg transition-colors ${
                    icon === ic ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full rounded-xl">
            {t("dialog.create.submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
