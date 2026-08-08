import { createServerFn } from "@tanstack/react-start";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export type StockAvailabilitySummary = {
  stock_rows: number;
  stock_products: number;
  matched_products: number;
  unmatched_stock_products: number;
  availability_changes: number;
};

export const updateStockAvailability = createServerFn({ method: "POST" })
  .validator((data: FormData) => data)
  .handler(async ({ data }): Promise<StockAvailabilitySummary> => {
    const file = data.get("file");

    if (!(file instanceof File)) {
      throw new Error("Select a stock file to upload.");
    }
    if (!file.name.toLowerCase().endsWith(".xls")) {
      throw new Error("Use the SAP stock export in .xls format.");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("The stock file must be 10 MB or smaller.");
    }

    const [{ mkdtemp, rm, writeFile }, { tmpdir }, { join }] = await Promise.all([
      import("node:fs/promises"),
      import("node:os"),
      import("node:path"),
    ]);
    const uploadDirectory = await mkdtemp(join(tmpdir(), "phone-club-stock-"));
    const uploadedFilePath = join(uploadDirectory, "stock-upload.xls");

    try {
      await writeFile(uploadedFilePath, Buffer.from(await file.arrayBuffer()));
      const { runStockAvailability } = await import("../manage-availability.js");
      return await runStockAvailability(uploadedFilePath);
    } finally {
      await rm(uploadDirectory, { force: true, recursive: true });
    }
  });
