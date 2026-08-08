import { createFileRoute } from "@tanstack/react-router";
import {
  Boxes,
  Download,
  FileDown,
  FileSpreadsheet,
  PackageX,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { UploadArea } from "@/components/stock/UploadArea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats, stockRows } from "@/data/mock-data";

export const Route = createFileRoute("/stock")({
  head: () => ({
    meta: [
      { title: "Stock Management — Phone Club Admin" },
      {
        name: "description",
        content: "Bulk-upload stock sheets and monitor low or out-of-stock mobile phones.",
      },
      { property: "og:title", content: "Stock Management — Phone Club Admin" },
      {
        property: "og:description",
        content: "Bulk-upload stock sheets and monitor low or out-of-stock mobile phones.",
      },
    ],
  }),
  component: StockPage,
});

function StockPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Management"
        description="Import stock sheets and keep every SKU accurate across warehouses."
        actions={
          <>
            <Button variant="outline" className="rounded-xl">
              <FileDown className="h-4 w-4" /> Sample Excel
            </Button>
            <Button variant="outline" className="rounded-xl">
              <Download className="h-4 w-4" /> Current Stock
            </Button>
            <Button variant="outline" className="rounded-xl">
              <FileSpreadsheet className="h-4 w-4" /> Export Stock
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Available Products"
          value={dashboardStats.availableProducts}
          icon={Boxes}
          trend={{ value: "+5%", direction: "up" }}
          subtitle="healthy stock"
          tone="success"
        />
        <StatCard
          label="Low Stock"
          value={dashboardStats.lowStock}
          icon={TriangleAlert}
          trend={{ value: "+2", direction: "up" }}
          subtitle="below 8 units"
          tone="warning"
        />
        <StatCard
          label="Out of Stock"
          value={dashboardStats.outOfStock}
          icon={PackageX}
          trend={{ value: "-1", direction: "down" }}
          subtitle="restock urgently"
          tone="destructive"
        />
        <StatCard
          label="Recently Updated"
          value={stockRows.length}
          icon={RefreshCw}
          trend={{ value: "+18", direction: "up" }}
          subtitle="in the last 24h"
        />
      </div>

      <Card className="card-soft rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-base font-bold">Upload Excel</CardTitle>
          <CardDescription>
            Import the SAP stock export to update product quantities and availability immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadArea />
        </CardContent>
      </Card>
    </div>
  );
}
