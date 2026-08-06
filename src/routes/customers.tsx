import { createFileRoute } from "@tanstack/react-router";
import { UserRound, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge } from "@/components/common/StatusBadge";
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
import { currency, customers, formatDate } from "@/data/mock-data";

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      [c.name, c.email, c.phone].some((f) => f.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description={`${customers.length} registered customers`}
      />

      <Card className="card-soft overflow-hidden rounded-2xl border p-0">
        <div className="border-b p-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search name, email or phone…"
            className="md:max-w-sm"
          />
        </div>

        {filtered.length === 0 ? (
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
                  <TableHead>Phone</TableHead>
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
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {customer.phone}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">{customer.orders}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {currency(customer.totalSpent)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(customer.joinedAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={customer.status} />
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
      </Card>
    </div>
  );
}