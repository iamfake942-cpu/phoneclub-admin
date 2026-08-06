import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ordersThisWeek, revenueThisMonth, topBrands, topMobiles } from "@/data/mock-data";

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: 12,
};

const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="card-soft rounded-2xl border">
      <CardHeader>
        <CardTitle className="text-base font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-64 px-2">{children}</CardContent>
    </Card>
  );
}

export function DashboardCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Orders this week" description="Daily order volume across all channels">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ordersThisWeek} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" {...axis} />
            <YAxis {...axis} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#ordersFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Revenue this month" description="Weekly revenue vs target (₹)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueThisMonth} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="week" {...axis} />
            <YAxis {...axis} tickFormatter={(v: number) => `${Math.round(v / 100000)}L`} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="target" fill="var(--muted)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="revenue" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top selling brands" description="Share of units sold this month">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={topBrands}
              dataKey="value"
              nameKey="brand"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
            >
              {topBrands.map((entry, index) => (
                <Cell key={entry.brand} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top selling mobiles" description="Units sold in the last 30 days">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topMobiles}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 24, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" horizontal={false} />
            <XAxis type="number" {...axis} />
            <YAxis type="category" dataKey="model" width={120} {...axis} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="units" fill="var(--chart-2)" radius={[0, 8, 8, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}