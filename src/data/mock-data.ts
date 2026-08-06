/**
 * Mock data layer for the Phone Club admin dashboard.
 *
 * Everything here is static JSON-like data. When a Node.js backend is added,
 * replace the exported getters with fetch calls — component code only imports
 * from this module, never from a hard-coded literal.
 */

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus = "Paid" | "Unpaid" | "Refunded" | "Failed";

export type Availability = "In Stock" | "Low Stock" | "Out of Stock";

export interface Product {
  id: string;
  brand: string;
  model: string;
  slug: string;
  price: number;
  mrp: number;
  storage: string;
  ram: string;
  color: string;
  processor: string;
  os: string;
  battery: string;
  camera: string;
  display: string;
  stock: number;
  availability: Availability;
  status: "Active" | "Draft";
  updatedAt: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  amount: number;
  paymentMethod: "UPI" | "Card" | "Net Banking" | "COD" | "Wallet";
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
  status: "Active" | "Inactive" | "Blocked";
}

export type NotificationKind =
  | "New Order"
  | "Payment Received"
  | "Low Stock"
  | "Product Added"
  | "Stock Updated"
  | "Customer Registered";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  timestamp: string;
  priority: "High" | "Medium" | "Low";
  unread: boolean;
}

const brands = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Google",
  "Xiaomi",
  "Nothing",
  "Vivo",
  "Oppo",
  "Realme",
  "Motorola",
] as const;

const modelsByBrand: Record<string, string[]> = {
  Apple: ["iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17", "iPhone 16e", "iPhone 16 Plus"],
  Samsung: [
    "Galaxy S25 Ultra",
    "Galaxy S25+",
    "Galaxy S25",
    "Galaxy Z Fold 7",
    "Galaxy A56 5G",
  ],
  OnePlus: ["OnePlus 13", "OnePlus 13R", "OnePlus Open 2", "OnePlus Nord 5", "OnePlus 12T"],
  Google: ["Pixel 10 Pro XL", "Pixel 10 Pro", "Pixel 10", "Pixel 9a", "Pixel Fold 2"],
  Xiaomi: ["Xiaomi 15 Ultra", "Xiaomi 15", "Redmi Note 14 Pro+", "Poco F7 Pro", "Redmi K80"],
  Nothing: ["Nothing Phone 3", "Nothing Phone 3a", "CMF Phone 2", "Nothing Phone 2a+", "CMF Phone 1"],
  Vivo: ["Vivo X200 Pro", "Vivo X200", "Vivo V50", "Vivo T4 Pro", "Vivo Y400"],
  Oppo: ["Oppo Find X8 Pro", "Oppo Find N5", "Oppo Reno 13 Pro", "Oppo F29 Pro", "Oppo A5 Pro"],
  Realme: ["Realme GT 7 Pro", "Realme GT 7", "Realme 14 Pro+", "Realme Narzo 80", "Realme P3 Ultra"],
  Motorola: ["Edge 60 Pro", "Razr 60 Ultra", "Edge 60 Fusion", "Moto G86", "ThinkPhone 25"],
};

const colors = ["Midnight Black", "Titanium Grey", "Arctic Silver", "Ocean Blue", "Sunset Gold"];
const storages = ["128 GB", "256 GB", "512 GB", "1 TB"];
const rams = ["8 GB", "12 GB", "16 GB"];
const processors = [
  "A19 Bionic",
  "Snapdragon 8 Elite",
  "Dimensity 9400",
  "Tensor G5",
  "Exynos 2500",
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function availabilityFor(stock: number): Availability {
  if (stock === 0) return "Out of Stock";
  if (stock <= 8) return "Low Stock";
  return "In Stock";
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function isoDaysAgo(days: number, hour = 10, minute = 30) {
  const base = new Date(Date.UTC(2026, 7, 6, hour, minute));
  base.setUTCDate(base.getUTCDate() - days);
  return base.toISOString();
}

export const products: Product[] = Array.from({ length: 50 }, (_, index) => {
  const brand = brands[index % brands.length]!;
  const model = modelsByBrand[brand]![Math.floor(index / brands.length) % 5]!;
  const price = 24999 + ((index * 4637) % 110000);
  const stock = [0, 3, 6, 12, 24, 48, 7, 0, 31, 15][index % 10]!;
  return {
    id: `PRD-${1000 + index}`,
    brand,
    model,
    slug: slugify(`${brand}-${model}`),
    price,
    mrp: price + 5000 + (index % 4) * 2500,
    storage: storages[index % storages.length]!,
    ram: rams[index % rams.length]!,
    color: colors[index % colors.length]!,
    processor: processors[index % processors.length]!,
    os: brand === "Apple" ? "iOS 19" : "Android 16",
    battery: `${4200 + (index % 6) * 300} mAh`,
    camera: `${[48, 50, 108, 200][index % 4]!} MP Triple`,
    display: `${(6.1 + (index % 5) * 0.2).toFixed(1)}" AMOLED 120Hz`,
    stock,
    availability: availabilityFor(stock),
    status: index % 11 === 0 ? "Draft" : "Active",
    updatedAt: isoDaysAgo(index % 14, 9 + (index % 8)),
    image: `https://images.unsplash.com/photo-${
      [
        "1511707171634-5f897ff02aa9",
        "1592750475338-74b7b21085ab",
        "1580910051074-3eb694886505",
        "1567581935884-3349723552ca",
        "1585060544812-6b45742d762f",
      ][index % 5]!
    }?auto=format&fit=crop&w=200&q=60`,
  };
});

const customerNames = [
  "Aarav Sharma",
  "Diya Patel",
  "Vihaan Reddy",
  "Anaya Iyer",
  "Kabir Nair",
  "Ishita Menon",
  "Rohan Gupta",
  "Meera Joshi",
  "Arjun Verma",
  "Sara Khan",
  "Nikhil Rao",
  "Tanvi Desai",
  "Aditya Bose",
  "Priya Kulkarni",
  "Yash Malhotra",
];

export const customers: Customer[] = customerNames.map((name, index) => {
  const orders = 1 + ((index * 3) % 12);
  return {
    id: `CUS-${2000 + index}`,
    name,
    email: `${slugify(name)}@phoneclub.io`,
    phone: `+91 9${pad(index)}45 6${pad(index)}20`,
    orders,
    totalSpent: orders * (28990 + index * 1750),
    joinedAt: isoDaysAgo(30 + index * 11, 12),
    status: index % 7 === 0 ? "Inactive" : index === 11 ? "Blocked" : "Active",
  };
});

const orderStatuses: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const paymentStatuses: PaymentStatus[] = ["Paid", "Unpaid", "Refunded", "Failed"];
const paymentMethods: Order["paymentMethod"][] = ["UPI", "Card", "Net Banking", "COD", "Wallet"];

export const orders: Order[] = Array.from({ length: 25 }, (_, index) => {
  const customer = customers[index % customers.length]!;
  const product = products[(index * 7) % products.length]!;
  const quantity = 1 + (index % 3);
  const status = orderStatuses[index % orderStatuses.length]!;
  return {
    id: `ORD-${index}`,
    orderNumber: `PC${10230 + index}`,
    customer: customer.name,
    email: customer.email,
    phone: customer.phone,
    product: `${product.brand} ${product.model}`,
    quantity,
    amount: product.price * quantity,
    paymentMethod: paymentMethods[index % paymentMethods.length]!,
    paymentStatus:
      status === "Cancelled" ? "Refunded" : paymentStatuses[index % paymentStatuses.length]!,
    status,
    createdAt: isoDaysAgo(index % 20, 8 + (index % 10), (index * 7) % 60),
  };
});

export const notifications: AppNotification[] = [
  {
    id: "N1",
    kind: "New Order",
    title: "New Order #PC10254 received",
    description: "Aarav Sharma ordered an iPhone 17 Pro Max (256 GB).",
    timestamp: isoDaysAgo(0, 13, 12),
    priority: "High",
    unread: true,
  },
  {
    id: "N2",
    kind: "Payment Received",
    title: "Order #PC10255 paid successfully",
    description: "₹1,49,900 received via UPI from Diya Patel.",
    timestamp: isoDaysAgo(0, 12, 40),
    priority: "Medium",
    unread: true,
  },
  {
    id: "N3",
    kind: "Low Stock",
    title: "Samsung Galaxy S25 Ultra stock running low",
    description: "Only 3 units left in the warehouse.",
    timestamp: isoDaysAgo(0, 11, 5),
    priority: "High",
    unread: true,
  },
  {
    id: "N4",
    kind: "Low Stock",
    title: "iPhone 17 Pro Max is out of stock",
    description: "Restock required — 14 pending pre-orders.",
    timestamp: isoDaysAgo(0, 9, 48),
    priority: "High",
    unread: true,
  },
  {
    id: "N5",
    kind: "Product Added",
    title: "Nothing Phone 3 added to catalogue",
    description: "Draft created by admin@phoneclub.io.",
    timestamp: isoDaysAgo(1, 17, 22),
    priority: "Low",
    unread: false,
  },
  {
    id: "N6",
    kind: "Stock Updated",
    title: "Stock sheet imported",
    description: "42 SKUs updated from stock-august.xlsx.",
    timestamp: isoDaysAgo(1, 10, 2),
    priority: "Medium",
    unread: false,
  },
  {
    id: "N7",
    kind: "Customer Registered",
    title: "New customer registered",
    description: "Tanvi Desai created an account.",
    timestamp: isoDaysAgo(2, 15, 30),
    priority: "Low",
    unread: false,
  },
  {
    id: "N8",
    kind: "New Order",
    title: "New Order #PC10248 received",
    description: "Kabir Nair ordered a OnePlus 13 (512 GB).",
    timestamp: isoDaysAgo(2, 11, 12),
    priority: "Medium",
    unread: false,
  },
  {
    id: "N9",
    kind: "Payment Received",
    title: "Order #PC10241 paid successfully",
    description: "₹79,499 received via Card from Rohan Gupta.",
    timestamp: isoDaysAgo(3, 14, 8),
    priority: "Low",
    unread: false,
  },
  {
    id: "N10",
    kind: "Stock Updated",
    title: "Pixel 10 Pro stock replenished",
    description: "+40 units added to the Bengaluru warehouse.",
    timestamp: isoDaysAgo(4, 9, 55),
    priority: "Medium",
    unread: false,
  },
];

export const ordersThisWeek = [
  { day: "Mon", orders: 42, revenue: 1240000 },
  { day: "Tue", orders: 58, revenue: 1680000 },
  { day: "Wed", orders: 51, revenue: 1425000 },
  { day: "Thu", orders: 74, revenue: 2110000 },
  { day: "Fri", orders: 96, revenue: 2740000 },
  { day: "Sat", orders: 112, revenue: 3210000 },
  { day: "Sun", orders: 83, revenue: 2380000 },
];

export const revenueThisMonth = [
  { week: "Week 1", revenue: 8420000, target: 8000000 },
  { week: "Week 2", revenue: 9610000, target: 8500000 },
  { week: "Week 3", revenue: 7890000, target: 9000000 },
  { week: "Week 4", revenue: 11240000, target: 9500000 },
];

export const topBrands = [
  { brand: "Apple", value: 34 },
  { brand: "Samsung", value: 27 },
  { brand: "OnePlus", value: 15 },
  { brand: "Google", value: 13 },
  { brand: "Xiaomi", value: 11 },
];

export const topMobiles = [
  { model: "iPhone 17 Pro Max", units: 412 },
  { model: "Galaxy S25 Ultra", units: 368 },
  { model: "OnePlus 13", units: 254 },
  { model: "Pixel 10 Pro", units: 197 },
  { model: "Nothing Phone 3", units: 143 },
];

export const stockRows = products.slice(0, 18).map((product, index) => ({
  id: product.id,
  brand: product.brand,
  model: product.model,
  currentStock: product.stock,
  newStock: Math.max(0, product.stock + ((index % 5) - 1) * 6),
  availability: availabilityFor(Math.max(0, product.stock + ((index % 5) - 1) * 6)),
  updatedAt: product.updatedAt,
}));

export const dashboardStats = {
  totalOrders: 1256,
  todaysOrders: 48,
  totalCustomers: 8432,
  totalProducts: products.length,
  availableProducts: products.filter((p) => p.availability === "In Stock").length,
  outOfStock: products.filter((p) => p.availability === "Out of Stock").length,
  lowStock: products.filter((p) => p.availability === "Low Stock").length,
};

export const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(iso));

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso),
  );

export const relativeTime = (iso: string) => {
  const now = new Date(Date.UTC(2026, 7, 6, 14, 0)).getTime();
  const diff = Math.round((new Date(iso).getTime() - now) / 60000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(diff, "minute");
  if (abs < 1440) return rtf.format(Math.round(diff / 60), "hour");
  return rtf.format(Math.round(diff / 1440), "day");
};