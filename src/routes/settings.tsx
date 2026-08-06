import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Phone Club Admin" },
      { name: "description", content: "Configure store details, admin profile and preferences." },
      { property: "og:title", content: "Settings — Phone Club Admin" },
      {
        property: "og:description",
        content: "Configure store details, admin profile and preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} defaultValue={defaultValue} className="rounded-xl" />
    </div>
  );
}

function ToggleRow({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean | undefined;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked ?? false} />
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage store information, notifications and security preferences."
        actions={
          <Button className="rounded-xl" onClick={() => toast.success("Settings saved (UI demo)")}>
            <Save className="h-4 w-4" /> Save changes
          </Button>
        }
      />

      <Tabs defaultValue="store">
        <TabsList className="flex h-auto w-full flex-wrap justify-start rounded-xl">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="mt-4">
          <Card className="card-soft rounded-2xl border">
            <CardHeader>
              <CardTitle className="text-base font-bold">Store information</CardTitle>
              <CardDescription>Details shown to customers on invoices and receipts.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Store name" defaultValue="Phone Club" />
              <Field label="Support email" defaultValue="support@phoneclub.io" type="email" />
              <Field label="Support phone" defaultValue="+91 98765 43210" />
              <Field label="GST number" defaultValue="29ABCDE1234F1Z5" />
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Store address</Label>
                <Textarea
                  rows={3}
                  className="rounded-xl"
                  defaultValue="41 MG Road, Indiranagar, Bengaluru, Karnataka 560038"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-4">
          <Card className="card-soft rounded-2xl border">
            <CardHeader>
              <CardTitle className="text-base font-bold">Admin profile</CardTitle>
              <CardDescription>Your personal admin account details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" defaultValue="Ravi Kumar" />
              <Field label="Email" defaultValue="admin@phoneclub.io" type="email" />
              <Field label="Phone" defaultValue="+91 90000 11122" />
              <Field label="Role" defaultValue="Super Admin" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="card-soft rounded-2xl border">
            <CardHeader>
              <CardTitle className="text-base font-bold">Notification preferences</CardTitle>
              <CardDescription>Choose which alerts reach your inbox and dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              <ToggleRow title="New orders" description="Alert me whenever an order is placed." defaultChecked />
              <ToggleRow title="Payment updates" description="Successful and failed payments." defaultChecked />
              <ToggleRow title="Low stock alerts" description="When a SKU falls below 8 units." defaultChecked />
              <ToggleRow title="Weekly digest" description="A Monday summary of store performance." />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-4">
          <Card className="card-soft rounded-2xl border">
            <CardHeader>
              <CardTitle className="text-base font-bold">Email settings</CardTitle>
              <CardDescription>SMTP configuration used for transactional emails.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="SMTP host" defaultValue="smtp.phoneclub.io" />
              <Field label="SMTP port" defaultValue="587" />
              <Field label="Username" defaultValue="mailer@phoneclub.io" />
              <Field label="From name" defaultValue="Phone Club Orders" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-4">
          <Card className="card-soft rounded-2xl border">
            <CardHeader>
              <CardTitle className="text-base font-bold">Theme</CardTitle>
              <CardDescription>Interface appearance for the admin console.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              <ToggleRow title="Dark mode" description="Use the theme toggle in the top bar." />
              <ToggleRow title="Compact tables" description="Tighter row height for dense data." defaultChecked />
              <ToggleRow title="Reduced motion" description="Minimise animations and transitions." />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card className="card-soft rounded-2xl border">
            <CardHeader>
              <CardTitle className="text-base font-bold">Security</CardTitle>
              <CardDescription>Protect your admin account and store data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Current password" type="password" />
                <Field label="New password" type="password" />
              </div>
              <Separator />
              <div className="divide-y">
                <ToggleRow
                  title="Two-factor authentication"
                  description="Require an OTP on every sign-in."
                  defaultChecked
                />
                <ToggleRow title="Login alerts" description="Email me about new device sign-ins." defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}