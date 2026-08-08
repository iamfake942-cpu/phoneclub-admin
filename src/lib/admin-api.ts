const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface AdminProfile {
  name?: string;
  email: string;
  role?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  auth_provider: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  order_count: number;
  total_order_Amount: number | string;
}

export interface AdminOrderItem {
  id: number;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: string;
  mrp: string;
  line_total: string;
}

export interface AdminOrder {
  id: number;
  user_id: number;
  merchant_order_reference: string;
  payment_method: string;
  order_status: string;
  payment_status: string;
  final_amount: string;
  currency: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  item_count: number;
  items: AdminOrderItem[];
}

interface UsersResponse {
  users: AdminUser[];
  pagination: Pagination;
}

interface OrdersResponse {
  orders: AdminOrder[];
  pagination: Pagination;
}

function getAccessToken() {
  if (typeof window === "undefined") return undefined;

  // Supports the common token key names while authentication is integrated.
  return ["access_token", "accessToken", "authToken", "token"]
    .map((key) => window.localStorage.getItem(key))
    .find(Boolean);
}

export function hasAccessToken() {
  return Boolean(getAccessToken());
}

export function clearAccessToken() {
  if (typeof window !== "undefined") {
    ["access_token", "accessToken", "authToken", "token"].forEach((key) => {
      window.localStorage.removeItem(key);
    });
    window.localStorage.removeItem("admin_profile");
  }
}

function getProfile(response: unknown): Partial<AdminProfile> | undefined {
  if (response == null || typeof response !== "object") return undefined;

  const value = response as Record<string, unknown>;
  const profile = {
    ...(typeof value.name === "string" ? { name: value.name } : {}),
    ...(typeof value.email === "string" ? { email: value.email } : {}),
    ...(typeof value.role === "string" ? { role: value.role } : {}),
  };
  if (Object.keys(profile).length > 0) return profile;

  for (const key of ["admin", "user", "profile", "data"]) {
    const nestedProfile = getProfile(value[key]);
    if (nestedProfile) return nestedProfile;
  }
}

export function getAdminProfile(): AdminProfile | undefined {
  if (typeof window === "undefined") return undefined;

  const storedProfile = window.localStorage.getItem("admin_profile");
  if (!storedProfile) return undefined;

  try {
    const profile = JSON.parse(storedProfile) as AdminProfile;
    return typeof profile.email === "string" ? profile : undefined;
  } catch {
    return undefined;
  }
}

function getToken(response: unknown): string | undefined {
  if (response == null || typeof response !== "object") return undefined;

  const value = response as Record<string, unknown>;
  for (const key of ["access_token", "accessToken", "token"]) {
    if (typeof value[key] === "string") return value[key];
  }

  return getToken(value.data);
}

async function request<T>(path: string, options?: { body?: unknown; token?: string }): Promise<T> {
  const token = options?.token ?? getAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options?.body ? "POST" : "GET",
    headers: {
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message =
      response.status === 401
        ? "Your session has expired. Please sign in again."
        : "Unable to load data.";
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function getAdminUsers(page: number, limit: number) {
  return request<UsersResponse>(`/api/admin/users?page=${page}&limit=${limit}`);
}

export function getAdminOrders(page: number, limit: number) {
  return request<OrdersResponse>(`/api/admin/orders?page=${page}&limit=${limit}`);
}

export async function requestAdminOtp(email: string, password: string) {
  const response = await request<unknown>("/api/auth/admin/login", {
    body: { email, password },
  });
  return { temporaryToken: getToken(response), profile: getProfile(response) };
}

export async function verifyAdminOtp(
  email: string,
  otp: string,
  temporaryToken?: string,
  loginProfile?: Partial<AdminProfile>,
) {
  const response = await request<unknown>("/api/auth/admin/verify-otp", {
    body: { email, otp },
    token: temporaryToken,
  });
  // Some APIs issue the access token during the login step and only confirm it here.
  const token = getToken(response) ?? temporaryToken;

  if (!token) throw new Error("The verification response did not include an access token.");

  window.localStorage.setItem("access_token", token);
  const profile = { email, ...loginProfile, ...getProfile(response) };
  window.localStorage.setItem("admin_profile", JSON.stringify(profile));
}
