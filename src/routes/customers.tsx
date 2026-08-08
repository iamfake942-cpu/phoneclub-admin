import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { UserRound, Users } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TablePagination } from "@/components/common/TablePagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, formatDate } from "@/data/mock-data";
import { getAdminUsers } from "@/lib/admin-api";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Phone Club Admin" },
      { name: "description", content: "Browse Phone Club customers, spend and order history." },
      { property: "og:title", content: "Customers — Phone Club Admin" },
      {
        property: "og:description",
        content: "Browse Phone Club customers, spend and order history.",
      },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: () => getAdminUsers(page, 20),
    enabled: typeof window !== "undefined",
  });
  const users = data?.users ?? [];

  const filtered = (() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) =>
      [user.name, user.email].some((field) => field.toLowerCase().includes(q)),
    );
  })();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description={`${data?.pagination.total ?? 0} registered customers`}
      />

      <Card className="card-soft overflow-hidden rounded-2xl border p-0">
        <div className="border-b p-4">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Search name or email…"
            className="md:max-w-sm"
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading customers…</div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-destructive">{error.message}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No customers found"
            description="No customer matches that search. Try a different name, email or phone number."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-right">Total spent</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((customer) => (
                  <TableRow key={customer.id} className="transition-colors hover:bg-accent/50">
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                            {customer.name
                              .split(" ")
                              .map((p) => p[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate font-semibold">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {customer.email}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {customer.order_count}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {currency(Number(customer.total_order_Amount))}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(customer.created_at)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={customer.is_active ? "Active" : "Inactive"} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <UserRound className="h-4 w-4" /> Profile
                      </Button>
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
