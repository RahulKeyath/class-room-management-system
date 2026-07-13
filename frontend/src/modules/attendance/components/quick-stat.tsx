import { LucideIcon } from "lucide-react";

export function QuickStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div
      className="rounded-lg px-4 py-3 flex items-center gap-3"
      style={{ background: "oklch(1 0 0 / 10%)" }}
    >
      <Icon className="h-5 w-5 opacity-80" />
      <div>
        <p className="text-[11px] opacity-70 leading-none">{label}</p>
        <p className="text-lg font-semibold leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}
