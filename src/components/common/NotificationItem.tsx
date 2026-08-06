import {
  Bell,
  CheckCircle2,
  PackagePlus,
  RefreshCw,
  ShoppingBag,
  TriangleAlert,
  UserPlus,
} from "lucide-react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/data/mock-data";
import { formatDateTime, relativeTime } from "@/data/mock-data";

const iconFor = {
  "New Order": { icon: ShoppingBag, tone: "bg-primary/10 text-primary" },
  "Payment Received": { icon: CheckCircle2, tone: "bg-success/10 text-success" },
  "Low Stock": { icon: TriangleAlert, tone: "bg-warning/15 text-warning" },
  "Product Added": { icon: PackagePlus, tone: "bg-info/10 text-info" },
  "Stock Updated": { icon: RefreshCw, tone: "bg-accent text-accent-foreground" },
  "Customer Registered": { icon: UserPlus, tone: "bg-chart-5/10 text-chart-5" },
} as const;

export function NotificationItem({
  notification,
  timeline = false,
}: {
  notification: AppNotification;
  timeline?: boolean;
}) {
  const config = iconFor[notification.kind] ?? { icon: Bell, tone: "bg-muted text-foreground" };
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "group relative flex gap-3 rounded-xl p-3 transition-colors hover:bg-accent/60",
        timeline && "pl-3",
      )}
    >
      <span
        className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", config.tone)}
        aria-hidden
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="min-w-0 text-sm font-semibold">{notification.title}</p>
          {notification.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{notification.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={notification.priority} />
          <span className="text-[11px] text-muted-foreground" title={formatDateTime(notification.timestamp)}>
            {relativeTime(notification.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}