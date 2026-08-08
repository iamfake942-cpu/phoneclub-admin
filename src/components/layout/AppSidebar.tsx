import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BarChart3,
  Boxes,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Smartphone,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Products", url: "/products", icon: Smartphone },
  { title: "Stock Management", url: "/stock", icon: Boxes },
  { title: "Customers", url: "/customers", icon: Users },
] as const;

const secondaryItems = [
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  const renderItems = (
    items: readonly { title: string; url: string; icon: typeof Bell; badge?: string }[],
  ) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
            <Link to={item.url} className="flex items-center gap-3">
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <Badge className="ml-auto h-5 shrink-0 rounded-full px-1.5 text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b px-3 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="gradient-primary grid h-9 w-9 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-sm">
            <Smartphone className="h-4.5 w-4.5" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold tracking-tight">
                Phone Club
              </span>
              <span className="block truncate text-xs text-muted-foreground">Admin Console</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Commerce</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(mainItems)}</SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(secondaryItems)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="p-3">
          <div className="card-soft rounded-xl border p-3">
            <p className="text-xs font-semibold">Store health</p>
            <p className="mt-1 text-xs text-muted-foreground">6 SKUs need restocking this week.</p>
            <Link
              to="/stock"
              className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
            >
              Review stock →
            </Link>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
