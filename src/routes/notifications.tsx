import { createFileRoute } from "@tanstack/react-router";
import { CheckCheck } from "lucide-react";

import { NotificationItem } from "@/components/common/NotificationItem";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { notifications } from "@/data/mock-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Phone Club Admin" },
      { name: "description", content: "Timeline of orders, payments and stock alerts." },
      { property: "og:title", content: "Notifications — Phone Club Admin" },
      {
        property: "og:description",
        content: "Timeline of orders, payments and stock alerts.",
      },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Everything that happened across your store, newest first."
        actions={
          <Button variant="outline" className="rounded-xl">
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </Button>
        }
      />

      <Card className="card-soft rounded-2xl border">
        <CardContent className="px-3 py-2">
          <ol className="relative space-y-1 border-l pl-4">
            {notifications.map((n) => (
              <li key={n.id} className="relative">
                <span className="absolute top-6 -left-[21px] h-2.5 w-2.5 rounded-full border-2 border-card bg-primary" />
                <NotificationItem notification={n} timeline />
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}