import { CheckCircle2, CloudUpload, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateStockAvailability, type StockAvailabilitySummary } from "@/stock-availability";

type UploadState = "idle" | "updating" | "success" | "error";

const ACCEPTED_EXTENSION = ".xls";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function UploadArea() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState("");
  const [summary, setSummary] = useState<StockAvailabilitySummary>();
  const [error, setError] = useState("");

  const uploadFile = async (file: File) => {
    setFileName(file.name);
    setSummary(undefined);
    setError("");

    if (!file.name.toLowerCase().endsWith(ACCEPTED_EXTENSION)) {
      setState("error");
      setError("Use the SAP stock export in .xls format.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setState("error");
      setError("The stock file must be 10 MB or smaller.");
      return;
    }

    setState("updating");
    try {
      const formData = new FormData();
      formData.append("file", file);
      setSummary(await updateStockAvailability({ data: formData }));
      setState("success");
    } catch (uploadError) {
      setState("error");
      setError(
        uploadError instanceof Error ? uploadError.message : "Unable to update availability.",
      );
    }
  };

  const reset = () => {
    setState("idle");
    setFileName("");
    setSummary(undefined);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (state !== "updating") setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file && state !== "updating") void uploadFile(file);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all",
          dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border bg-muted/30",
          state === "updating" && "pointer-events-none opacity-70",
        )}
      >
        <span className="gradient-primary grid h-14 w-14 place-items-center rounded-2xl text-primary-foreground shadow-md">
          <CloudUpload className="h-6 w-6" />
        </span>
        <div>
          <p className="text-base font-bold">Upload Stock Excel</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag &amp; drop your stock sheet here, or browse from your computer
          </p>
        </div>
        <Button
          className="rounded-xl"
          disabled={state === "updating"}
          onClick={() => inputRef.current?.click()}
        >
          Browse File
        </Button>
        <p className="text-xs text-muted-foreground">Supported format: .xls (max 10 MB)</p>
        <input
          ref={inputRef}
          type="file"
          accept=".xls"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadFile(file);
          }}
        />
      </div>

      {state !== "idle" && (
        <div className="animate-fade-in rounded-xl border p-4" aria-live="polite">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                state === "error"
                  ? "bg-destructive/10 text-destructive"
                  : state === "success"
                    ? "bg-success/10 text-success"
                    : "bg-primary/10 text-primary",
              )}
            >
              {state === "error" ? (
                <TriangleAlert className="h-4 w-4" />
              ) : state === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{fileName}</p>
              <p className="text-xs text-muted-foreground">
                {state === "updating" && "Updating availability. This can take a few minutes…"}
                {state === "success" && "Availability updated successfully."}
                {state === "error" && error}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={state === "updating"}
              onClick={reset}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {summary && (
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-4 text-sm sm:grid-cols-3">
              <SummaryItem label="Stock rows" value={summary.stock_rows} />
              <SummaryItem label="Stock products" value={summary.stock_products} />
              <SummaryItem label="Matched products" value={summary.matched_products} />
              <SummaryItem label="Unmatched products" value={summary.unmatched_stock_products} />
              <SummaryItem label="Availability changes" value={summary.availability_changes} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold tabular-nums">{value}</p>
    </div>
  );
}
