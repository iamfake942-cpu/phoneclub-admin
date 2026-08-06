import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, MoreHorizontal, Pencil, Plus, Smartphone, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TablePagination } from "@/components/common/TablePagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, formatDate, products } from "@/data/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Phone Club Admin" },
      { name: "description", content: "Manage the Phone Club mobile phone catalogue and pricing." },
      { property: "og:title", content: "Products — Phone Club Admin" },
      {
        property: "og:description",
        content: "Manage the Phone Club mobile phone catalogue and pricing.",
      },
    ],
  }),
  component: ProductsPage,
});

const PAGE_SIZE = 10;

const textFields = [
  { id: "brand", label: "Brand", placeholder: "Apple" },
  { id: "model", label: "Model name", placeholder: "iPhone 17 Pro Max" },
  { id: "slug", label: "Slug", placeholder: "apple-iphone-17-pro-max" },
  { id: "price", label: "Price (₹)", placeholder: "149900" },
  { id: "mrp", label: "MRP (₹)", placeholder: "159900" },
  { id: "storage", label: "Storage", placeholder: "256 GB" },
  { id: "ram", label: "RAM", placeholder: "12 GB" },
  { id: "color", label: "Color", placeholder: "Titanium Grey" },
  { id: "processor", label: "Processor", placeholder: "A19 Bionic" },
  { id: "os", label: "Operating system", placeholder: "iOS 19" },
  { id: "battery", label: "Battery", placeholder: "4800 mAh" },
  { id: "camera", label: "Camera", placeholder: "48 MP Triple" },
  { id: "display", label: "Display", placeholder: '6.9" AMOLED 120Hz' },
];

function ProductsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => `${p.brand} ${p.model}`.toLowerCase().includes(q));
  }, [query]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description={`${products.length} mobile phones in the catalogue`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-xl shadow-sm">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add product</DialogTitle>
                <DialogDescription>
                  Fill in the specifications for the new mobile phone.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                {textFields.map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input id={field.id} placeholder={field.placeholder} className="rounded-xl" />
                  </div>
                ))}

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Short marketing description shown on the product page…"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Product images</Label>
                  <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed bg-muted/30 px-4 py-8 text-center">
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium">Drop images here or click to upload</p>
                    <p className="text-xs text-muted-foreground">PNG or JPG up to 5 MB each</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Thumbnail</Label>
                  <Input type="file" className="rounded-xl" />
                </div>

                <div className="space-y-1.5">
                  <Label>Availability</Label>
                  <Select defaultValue="In Stock">
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select defaultValue="Active">
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="rounded-xl"
                  onClick={() => {
                    setOpen(false);
                    toast.success("Product saved (UI demo — no backend connected)");
                  }}
                >
                  Save product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="card-soft overflow-hidden rounded-2xl border p-0">
        <div className="border-b p-4">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Search by brand or model…"
            className="md:max-w-sm"
          />
        </div>

        {current.length === 0 ? (
          <EmptyState
            icon={Smartphone}
            title="No products match your search"
            description="Try a different brand or model name, or add a new product to the catalogue."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Last updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {current.map((product) => (
                  <TableRow key={product.id} className="transition-colors hover:bg-accent/50">
                    <TableCell>
                      <img
                        src={product.image}
                        alt={`${product.brand} ${product.model}`}
                        loading="lazy"
                        className="h-11 w-11 rounded-xl border object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-semibold">{product.brand}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{product.model}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {currency(product.price)}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">{product.stock}</TableCell>
                    <TableCell>
                      <StatusBadge status={product.availability} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(product.updatedAt)}
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
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4" /> Delete
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

        <TablePagination
          page={page}
          pageCount={pageCount}
          total={filtered.length}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}