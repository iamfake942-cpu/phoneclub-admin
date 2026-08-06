import { CheckCircle2, CloudUpload, FileSpreadsheet, TriangleAlert, X } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "success" | "error";

const ACCEPTED = [".xlsx", ".xls", ".csv"];

export function UploadArea() {
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const startMockUpload = (file: File) => {
    setFileName(file.name);
    const valid = ACCEPTED.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!valid) {
      setState("error");
      setProgress(0);
      return;
    }
    setState("uploading");
    setProgress(0);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (timer.current) clearInterval(timer.current);
          setState("success");
          return 100;
        }
        return prev + 8;
      });
    }, 120);
  };

  const reset = () => {
    if (timer.current) clearInterval(timer.current);
    setState("idle");
    setProgress(0);
    setFileName("");
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) startMockUpload(file);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all",
          dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border bg-muted/30",
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
        <Button className="rounded-xl" onClick={() => inputRef.current?.click()}>
          Browse File
        </Button>
        <p className="text-xs text-muted-foreground">Supported formats: .xlsx, .xls, .csv (max 10 MB)</p>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) startMockUpload(file);
          }}
        />
      </div>

      {state !== "idle" && (
        <div className="animate-fade-in rounded-xl border p-4">
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
                <FileSpreadsheet className="h-4 w-4" />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{fileName}</p>
              <p className="text-xs text-muted-foreground">
                {state === "uploading" && `Uploading… ${Math.min(progress, 100)}%`}
                {state === "success" && "Upload complete · 42 SKUs ready to review"}
                {state === "error" && "Unsupported file format. Use .xlsx, .xls or .csv"}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={reset}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {state === "uploading" && <Progress value={Math.min(progress, 100)} className="mt-3 h-2" />}
        </div>
      )}
    </div>
  );
}