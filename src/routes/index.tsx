import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Boxes,
  CalendarClock,
  PackageX,
  ShoppingCart,
  Smartphone,
  TriangleAlert,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { NotificationItem } from "@/components/common/NotificationItem";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, dashboardStats, formatDate, notifications, orders } from "@/data/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Phone Club Admin" },
      {
        name: "description",
        content: "Live overview of Phone Club orders, revenue, stock levels and customers.",
      },
      { property: "og:title", content: "Dashboard — Phone Club Admin" },
      {
        property: "og:description",
        content: "Live overview of Phone Club orders, revenue, stock levels and customers.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const recent = orders.slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back, Ravi. Here's what's happening in your store today."
        actions={
          <>
            <Button variant="outline" className="rounded-xl">
              <CalendarClock className="h-4 w-4" /> Last 30 days
            </Button>
            <Button asChild className="rounded-xl">
              <Link to="/products">Add product</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={dashboardStats.totalOrders.toLocaleString("en-IN")}
          icon={ShoppingCart}
          trend={{ value: "+12%", direction: "up" }}
          subtitle="this month"
        />
        <StatCard
          label="Today's Orders"
          value={dashboardStats.todaysOrders}
          icon={CalendarClock}
          trend={{ value: "+8%", direction: "up" }}
          subtitle="vs yesterday"
          tone="success"
        />
        <StatCard
          label="Total Customers"
          value={dashboardStats.totalCustomers.toLocaleString("en-IN")}
          icon={Users}
          trend={{ value: "+4.2%", direction: "up" }}
          subtitle="active buyers"
        />
        <StatCard
          label="Total Products"
          value={dashboardStats.totalProducts}
          icon={Smartphone}
          trend={{ value: "+6", direction: "up" }}
          subtitle="SKUs in catalogue"
        />
        <StatCard
          label="Available Products"
          value={dashboardStats.availableProducts}
          icon={Boxes}
          trend={{ value: "+3%", direction: "up" }}
          subtitle="ready to ship"
          tone="success"
        />
        <StatCard
          label="Out of Stock"
          value={dashboardStats.outOfStock}
          icon={PackageX}
          trend={{ value: "-2", direction: "down" }}
          subtitle="needs restocking"
          tone="destructive"
        />
        <StatCard
          label="Low Stock"
          value={dashboardStats.lowStock}
          icon={TriangleAlert}
          trend={{ value: "+1", direction: "up" }}
          subtitle="below threshold"
          tone="warning"
        />
        <StatCard
          label="Revenue (MTD)"
          value="₹3.7 Cr"
          icon={ShoppingCart}
          trend={{ value: "+18%", direction: "up" }}
          subtitle="vs last month"
        />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-3">
        <Card className="card-soft rounded-2xl border xl:col-span-2">
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <CardTitle className="text-base font-bold">Recent Orders</CardTitle>
              <CardDescription>Latest 8 orders placed on Phone Club</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-lg">
              <Link to="/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((order) => (
                    <TableRow key={order.id} className="transition-colors hover:bg-accent/50">
                      <TableCell className="font-semibold">{order.orderNumber}</TableCell>
                      <TableCell className="whitespace-nowrap">{order.customer}</TableCell>
                      <TableCell className="max-w-[180px] truncate">{order.product}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {currency(order.amount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.paymentStatus} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft rounded-2xl border">
          <CardHeader>
            <CardTitle className="text-base font-bold">New Order Notifications</CardTitle>
            <CardDescription>Real-time store activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 px-3">
            {notifications.slice(0, 5).map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
            <Button asChild variant="ghost" className="w-full rounded-xl text-primary">
              <Link to="/notifications">See all notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts />
    </div>
  );
}