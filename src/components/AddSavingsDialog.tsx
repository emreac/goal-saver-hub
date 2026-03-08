import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PiggyBank } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface AddSavingsDialogProps {
  goalName: string;
  onAdd: (amount: number, note?: string) => void;
}

export function AddSavingsDialog({ goalName, onAdd }: AddSavingsDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    onAdd(parseFloat(amount), note || undefined);
    setAmount("");
    setNote("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 rounded-full text-xs">
          <PiggyBank className="h-3.5 w-3.5" />
          {t("goals.add")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">{t("dialog.add.title")} "{goalName}"</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>{t("dialog.add.amount")}</Label>
            <Input type="number" min="0.01" step="0.01" placeholder="50" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
          </div>
          <div className="space-y-2">
            <Label>{t("dialog.add.note")}</Label>
            <Textarea placeholder={t("dialog.add.note.placeholder")} value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
          </div>
          <Button type="submit" className="w-full rounded-xl">{t("dialog.add.submit")}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
