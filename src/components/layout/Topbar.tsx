import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, LogOut, Moon, Search, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { relativeTime } from "@/data/mock-data";
import {
  clearAccessToken,
  getAdminOrders,
  getAdminProfile,
  type AdminOrder,
} from "@/lib/admin-api";

type OrderNotification = {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
};

function createOrderNotification(order: AdminOrder): OrderNotification {
  return {
    id: order.id,
    title: "New order received",
    description: `${order.customer_name} placed ${order.merchant_order_reference}.`,
    timestamp: order.created_at,
    unread: true,
  };
}

function initials(name: string) {
  return name
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function displayRole(role?: string) {
  return role
    ? role.replace(/[_-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Administrator";
}

export function Topbar() {
  const [dark, setDark] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState<OrderNotification[]>([]);
  const knownOrderIds = useRef(new Set<number>());
  const hasLoadedOrders = useRef(false);
  const navigate = useNavigate();
  const { data: ordersData } = useQuery({
    queryKey: ["admin-orders", "notifications"],
    queryFn: () => getAdminOrders(1, 20),
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
  const latestOrders = ordersData?.orders;
  const unread = orderNotifications.filter((notification) => notification.unread).length;
  const admin = getAdminProfile();
  const adminName = admin?.name || admin?.email || "Administrator";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (!latestOrders) return;

    if (!hasLoadedOrders.current) {
      latestOrders.forEach((order) => knownOrderIds.current.add(order.id));
      hasLoadedOrders.current = true;
      return;
    }

    const newOrders = latestOrders.filter((order) => !knownOrderIds.current.has(order.id));
    newOrders.forEach((order) => knownOrderIds.current.add(order.id));

    if (newOrders.length > 0) {
      setOrderNotifications((current) =>
        [...newOrders.map(createOrderNotification), ...current].slice(0, 10),
      );
    }
  }, [latestOrders]);

  return (
    <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-xl">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 sm:px-6">
        <SidebarTrigger className="shrink-0" />

        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders, products, customers…"
            className="h-10 w-full rounded-xl pl-9 md:max-w-md"
          />
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            aria-label="Toggle theme"
            onClick={() => setDark((v) => !v)}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl"
                aria-label="Notifications"
                onClick={() =>
                  setOrderNotifications((current) =>
                    current.map((notification) => ({ ...notification, unread: false })),
                  )
                }
              >
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {unread}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>New orders</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {orderNotifications.length === 0 ? (
                <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                  No new orders yet.
                </p>
              ) : (
                orderNotifications.slice(0, 4).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex-col items-start gap-0.5 py-2"
                  >
                    <span className="text-xs font-semibold">{notification.title}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {notification.description} · {relativeTime(notification.timestamp)}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/orders" className="text-xs font-semibold text-primary">
                  View orders
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-accent">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="gradient-primary text-xs font-bold text-primary-foreground">
                    {initials(adminName)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-left leading-tight lg:block">
                  <span className="block max-w-40 truncate text-xs font-semibold">{adminName}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {displayRole(admin?.role)}
                  </span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Preferences</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  clearAccessToken();
                  navigate({ to: "/login", replace: true });
                }}
              >
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
