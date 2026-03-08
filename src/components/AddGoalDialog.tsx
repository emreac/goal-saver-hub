import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { getAvailableIcons } from "@/hooks/useSavingsStore";

interface AddGoalDialogProps {
  onAdd: (goal: { name: string; targetAmount: number; deadline: string; icon: string }) => void;
}

export function AddGoalDialog({ onAdd }: AddGoalDialogProps) {
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
          New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Create Savings Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label>Goal Name</Label>
            <Input placeholder="e.g. New iPhone" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Target Amount ($)</Label>
            <Input type="number" min="1" step="0.01" placeholder="1000" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Target Date</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {icons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`text-2xl p-2 rounded-xl transition-colors ${
                    icon === ic ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full rounded-xl">
            Create Goal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
