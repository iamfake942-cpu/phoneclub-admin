import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  Eye,
  MoreHorizontal,
  Pencil,
  Printer,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TablePagination } from "@/components/common/TablePagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, formatDate } from "@/data/mock-data";
import { getAdminOrders } from "@/lib/admin-api";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Phone Club Admin" },
      { name: "description", content: "Search, filter and manage every Phone Club order." },
      { property: "og:title", content: "Orders — Phone Club Admin" },
      {
        property: "og:description",
        content: "Search, filter and manage every Phone Club order.",
      },
    ],
  }),
  component: OrdersPage,
});

const PAGE_SIZE = 20;

function displayStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function OrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [range, setRange] = useState("30");
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin-orders", page],
    queryFn: () => getAdminOrders(page, PAGE_SIZE),
    enabled: typeof window !== "undefined",
  });
  const orders = data?.orders ?? [];

  const filtered = orders.filter((order) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      [
        order.merchant_order_reference,
        order.customer_name,
        order.customer_email,
        ...order.items.map((item) => item.product_name),
      ].some((field) => field.toLowerCase().includes(q));
    const matchesStatus = status === "all" || order.order_status === status;
    const matchesPayment = payment === "all" || order.payment_status === payment;
    return matchesQuery && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description={`${data?.pagination.total ?? 0} total orders`}
        actions={
          <Button variant="outline" className="rounded-xl">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <Card className="card-soft overflow-hidden rounded-2xl border p-0">
        <div className="grid gap-3 border-b p-4 md:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Search order number, customer or product…"
          />
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-full rounded-xl md:w-40">
              <SelectValue placeholder="Order status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["PENDING_PAYMENT", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"].map(
                (s) => (
                  <SelectItem key={s} value={s}>
                    {displayStatus(s)}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <Select
            value={payment}
            onValueChange={(value) => {
              setPayment(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-full rounded-xl md:w-40">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              {["PENDING", "PAID", "REFUNDED", "FAILED"].map((s) => (
                <SelectItem key={s} value={s}>
                  {displayStatus(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="h-10 w-full rounded-xl md:w-40">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading orders…</div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-destructive">{error.message}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="No orders found"
            description="Try adjusting your search terms or filters to find what you're looking for."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => (
                  <TableRow key={order.id} className="transition-colors hover:bg-accent/50">
                    <TableCell className="font-semibold">
                      {order.merchant_order_reference}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{order.customer_name}</TableCell>
                    <TableCell className="max-w-[180px] truncate text-muted-foreground">
                      {order.customer_email}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">
                      {order.items.map((item) => item.product_name).join(", ") || "—"}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">{order.item_count}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {currency(Number(order.final_amount))}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{order.payment_method}</TableCell>
                    <TableCell>
                      <StatusBadge status={displayStatus(order.payment_status)} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={displayStatus(order.order_status)} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4" /> Print invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <XCircle className="h-4 w-4" /> Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {data && (
          <TablePagination
            page={data.pagination.page}
            pageCount={data.pagination.total_pages}
            total={data.pagination.total}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  );
}
