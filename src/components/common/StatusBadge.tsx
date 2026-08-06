import { cn } from "@/lib/utils";

type Variant = "neutral" | "info" | "primary" | "success" | "warning" | "destructive";

const map: Record<string, Variant> = {
  Pending: "warning",
  Confirmed: "info",
  Packed: "primary",
  Shipped: "info",
  Delivered: "success",
  Cancelled: "destructive",
  Paid: "success",
  Unpaid: "warning",
  Refunded: "neutral",
  Failed: "destructive",
  "In Stock": "success",
  "Low Stock": "warning",
  "Out of Stock": "destructive",
  Active: "success",
  Inactive: "neutral",
  Blocked: "destructive",
  Draft: "neutral",
  High: "destructive",
  Medium: "warning",
  Low: "neutral",
};

const styles: Record<Variant, string> = {
  neutral: "bg-muted text-muted-foreground ring-border",
  info: "bg-info/10 text-info ring-info/20",
  primary: "bg-primary/10 text-primary ring-primary/20",
  success: "bg-success/10 text-success ring-success/20",
  warning: "bg-warning/15 text-warning ring-warning/25",
  destructive: "bg-destructive/10 text-destructive ring-destructive/20",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const variant = map[status] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap",
        styles[variant],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}