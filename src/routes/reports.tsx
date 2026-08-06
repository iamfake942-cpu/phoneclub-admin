import { createFileRoute } from "@tanstack/react-router";
import { Download, IndianRupee, ShoppingCart, TrendingUp, Users } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { topBrands } from "@/data/mock-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Phone Club Admin" },
      { name: "description", content: "Sales, revenue and brand performance reports for Phone Club." },
      { property: "og:title", content: "Reports — Phone Club Admin" },
      {
        property: "og:description",
        content: "Sales, revenue and brand performance reports for Phone Club.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Performance snapshots across sales, revenue and customers."
        actions={
          <Button variant="outline" className="rounded-xl">
            <Download className="h-4 w-4" /> Download report
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Gross Revenue"
          value="₹3.71 Cr"
          icon={IndianRupee}
          trend={{ value: "+18%", direction: "up" }}
          subtitle="vs last month"
        />
        <StatCard
          label="Units Sold"
          value="1,842"
          icon={ShoppingCart}
          trend={{ value: "+11%", direction: "up" }}
          subtitle="this month"
          tone="success"
        />
        <StatCard
          label="New Customers"
          value="312"
          icon={Users}
          trend={{ value: "-3%", direction: "down" }}
          subtitle="vs last month"
          tone="warning"
        />
        <StatCard
          label="Conversion Rate"
          value="4.6%"
          icon={TrendingUp}
          trend={{ value: "+0.4pt", direction: "up" }}
          subtitle="storefront average"
        />
      </div>

      <DashboardCharts />

      <Card className="card-soft rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-base font-bold">Brand contribution</CardTitle>
          <CardDescription>Share of total units sold this month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topBrands.map((brand) => (
            <div key={brand.brand} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{brand.brand}</span>
                <span className="tabular-nums text-muted-foreground">{brand.value}%</span>
              </div>
              <Progress value={brand.value * 2.5} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}