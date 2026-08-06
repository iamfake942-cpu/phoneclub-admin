import { createFileRoute } from "@tanstack/react-router";
import {
  Boxes,
  CheckCircle2,
  Download,
  FileDown,
  FileSpreadsheet,
  PackageX,
  RefreshCw,
  TriangleAlert,
  Upload,
} from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UploadArea } from "@/components/stock/UploadArea";
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
import { dashboardStats, formatDateTime, stockRows } from "@/data/mock-data";
import { cn } from "@/lib/utils";

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
            <Button className="rounded-xl">
              <Upload className="h-4 w-4" /> Upload Stock
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
            Bulk-update stock levels by importing your warehouse spreadsheet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadArea />
        </CardContent>
      </Card>

      <Card className="card-soft overflow-hidden rounded-2xl border p-0">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b p-4">
          <div className="min-w-0">
            <p className="text-base font-bold">Stock Preview</p>
            <p className="text-xs text-muted-foreground">
              Rows parsed from the last import — review before applying.
            </p>
          </div>
          <Button size="sm" className="shrink-0 rounded-lg">
            <CheckCircle2 className="h-4 w-4" /> Apply changes
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className="text-center">Current stock</TableHead>
                <TableHead className="text-center">New stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockRows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "transition-colors hover:bg-accent/50",
                    row.availability === "Out of Stock" && "bg-destructive/5",
                    row.availability === "Low Stock" && "bg-warning/5",
                  )}
                >
                  <TableCell className="font-semibold">{row.brand}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{row.model}</TableCell>
                  <TableCell className="text-center tabular-nums">{row.currentStock}</TableCell>
                  <TableCell
                    className={cn(
                      "text-center font-semibold tabular-nums",
                      row.newStock > row.currentStock ? "text-success" : "text-destructive",
                    )}
                  >
                    {row.newStock}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.availability} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDateTime(row.updatedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}