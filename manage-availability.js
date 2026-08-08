import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRODUCTS_JSON_FILE = path.join(__dirname, "new_data", "products.json");

const DRY_RUN = process.argv.includes("--dry-run");
const JSON_SUMMARY = process.argv.includes("--json-summary");

const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 20195,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Iamdb@26",
  database: process.env.DB_NAME || "phone_club",
};

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || "products";
const QUANTITY_COLUMN = process.env.QUANTITY_COLUMN || "quantity";
const PLANTS_COLUMN = process.env.PLANTS_COLUMN || "plants";

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function parseNumber(value) {
  const parsed = Number(
    String(value || "")
      .replace(/,/g, "")
      .trim(),
  );

  return Number.isFinite(parsed) ? parsed : 0;
}

function parseStockFile(filePath) {
  const content = fs.readFileSync(filePath, "utf16le").replace(/^\uFEFF/, "");
  const lines = content.split(/\r?\n/).filter(Boolean);
  const headerIndex = lines.findIndex((line) => {
    const normalized = line.toLowerCase();

    return normalized.includes("material") && normalized.includes("unrestr");
  });

  if (headerIndex === -1) {
    throw new Error("Could not find Material/Unrestr header in stock file.");
  }

  const headers = lines[headerIndex].split("\t").map((header) => header.trim().toLowerCase());
  const indexes = {
    material: headers.indexOf("material"),
    plant: headers.indexOf("plant"),
    unrestricted: headers.findIndex((header) => header.startsWith("unrestr")),
    description: headers.indexOf("material description"),
  };

  for (const [name, index] of Object.entries(indexes)) {
    if (index === -1) {
      throw new Error(`Could not find ${name} column in stock file.`);
    }
  }

  const rows = [];
  const grouped = new Map();

  for (const line of lines.slice(headerIndex + 1)) {
    const cols = line.split("\t");
    const material = String(cols[indexes.material] || "").trim();
    const plant = String(cols[indexes.plant] || "").trim();
    const quantity = parseNumber(cols[indexes.unrestricted]);
    const description = String(cols[indexes.description] || "").trim();

    if (!material || !plant || quantity <= 0) {
      continue;
    }

    const row = {
      material,
      plant,
      quantity,
      description,
    };

    rows.push(row);

    if (!grouped.has(material)) {
      grouped.set(material, {
        material,
        quantity: 0,
        plants: [],
        description,
        rows: [],
      });
    }

    const product = grouped.get(material);
    product.quantity += quantity;
    product.rows.push(row);

    if (!product.plants.includes(plant)) {
      product.plants.push(plant);
    }
  }

  return {
    rows,
    products: Array.from(grouped.values()).map((product) => ({
      ...product,
      quantity: Number(product.quantity.toFixed(3)),
    })),
  };
}

function createAvailabilityAudit(products, stockByMaterial) {
  return products.reduce((changes, product) => {
    const material = String(product.reliance_product_id || "");
    const stock = stockByMaterial.get(material);
    const shouldBeAvailable = Boolean(stock);
    const currentAvailability = product.is_available !== false;
    const currentQuantity = Number(product[QUANTITY_COLUMN] || 0);
    const currentPlants = normalizePlants(product[PLANTS_COLUMN]);
    const nextQuantity = stock ? stock.quantity : 0;
    const nextPlants = stock ? stock.plants : [];

    const productChanges = {};

    if (currentAvailability !== shouldBeAvailable) {
      productChanges.is_available = {
        old: currentAvailability,
        new: shouldBeAvailable,
      };
    }

    if (currentQuantity !== nextQuantity) {
      productChanges[QUANTITY_COLUMN] = {
        old: currentQuantity,
        new: nextQuantity,
      };
    }

    if (JSON.stringify(currentPlants) !== JSON.stringify(nextPlants)) {
      productChanges[PLANTS_COLUMN] = {
        old: currentPlants,
        new: nextPlants,
      };
    }

    if (Object.keys(productChanges).length) {
      changes.push({
        id: product.id,
        reliance_product_id: product.reliance_product_id,
        name: product.name,
        changes: productChanges,
      });
    }

    return changes;
  }, []);
}

function normalizePlants(value) {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function applyLocalAvailability(products, stockByMaterial) {
  const now = new Date().toISOString();

  for (const product of products) {
    const stock = stockByMaterial.get(String(product.reliance_product_id || ""));

    product.is_available = Boolean(stock);
    product[QUANTITY_COLUMN] = stock ? stock.quantity : 0;
    product[PLANTS_COLUMN] = stock ? stock.plants : [];
    product.updated_at = now;
  }
}

function createSummary(stockRows, stockProducts, matched, unmatched, changes) {
  return {
    stock_rows: stockRows.length,
    stock_products: stockProducts.length,
    matched_products: matched.length,
    unmatched_stock_products: unmatched.length,
    availability_changes: changes.length,
  };
}

function printSummary(summary) {
  console.log(`Stock rows             : ${summary.stock_rows}`);
  console.log(`Stock products         : ${summary.stock_products}`);
  console.log(`Matched products       : ${summary.matched_products}`);
  console.log(`Unmatched stock products: ${summary.unmatched_stock_products}`);
  console.log(`Availability changes   : ${summary.availability_changes}`);
}

async function loadDbProducts(connection) {
  const [rows] = await connection.execute(`
    SELECT
      id,
      reliance_product_id,
      name,
      is_available,
      \`${QUANTITY_COLUMN}\`,
      \`${PLANTS_COLUMN}\`
    FROM \`${PRODUCTS_TABLE}\`
  `);

  return rows;
}

async function updateDbAvailability(connection, stockProducts) {
  await connection.execute(
    `
      UPDATE \`${PRODUCTS_TABLE}\`
      SET
        is_available = FALSE,
        \`${QUANTITY_COLUMN}\` = 0,
        \`${PLANTS_COLUMN}\` = ?
    `,
    [JSON.stringify([])],
  );

  for (const product of stockProducts) {
    await connection.execute(
      `
        UPDATE \`${PRODUCTS_TABLE}\`
        SET
          is_available = TRUE,
          \`${QUANTITY_COLUMN}\` = ?,
          \`${PLANTS_COLUMN}\` = ?
        WHERE reliance_product_id = ?
      `,
      [product.quantity, JSON.stringify(product.plants), product.material],
    );
  }
}

function mapMatches(products, stockByMaterial) {
  const productsByRelianceId = new Map(
    products.map((product) => [String(product.reliance_product_id || ""), product]),
  );
  const matched = [];
  const unmatched = [];

  for (const stock of stockByMaterial.values()) {
    const product = productsByRelianceId.get(stock.material);

    if (!product) {
      unmatched.push(stock);
      continue;
    }

    matched.push({
      match_type: "material_to_reliance_product_id",
      material: stock.material,
      quantity: stock.quantity,
      plants: stock.plants,
      stock_description: stock.description,
      product,
    });
  }

  return { matched, unmatched };
}

async function runDryRun(stockRows, stockProducts, stockByMaterial) {
  const products = readJson(PRODUCTS_JSON_FILE, []);
  const { matched, unmatched } = mapMatches(products, stockByMaterial);
  const changes = createAvailabilityAudit(products, stockByMaterial);

  applyLocalAvailability(products, stockByMaterial);
  writeJson(PRODUCTS_JSON_FILE, products);

  const summary = createSummary(stockRows, stockProducts, matched, unmatched, changes);
  console.log("LOCAL PRODUCT JSON SYNC: no DB connection.");
  printSummary(summary);
  console.log(`Updated local file     : ${PRODUCTS_JSON_FILE}`);

  return summary;
}

async function runDbSync(stockRows, stockProducts, stockByMaterial) {
  const connection = await mysql.createConnection(dbConfig);

  try {
    await connection.beginTransaction();

    const products = await loadDbProducts(connection);
    const { matched, unmatched } = mapMatches(products, stockByMaterial);
    const changes = createAvailabilityAudit(products, stockByMaterial);

    await updateDbAvailability(connection, stockProducts);
    await connection.commit();

    const summary = createSummary(stockRows, stockProducts, matched, unmatched, changes);
    printSummary(summary);
    return summary;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

export async function runStockAvailability(stockFile, { dryRun = false } = {}) {
  if (!stockFile) {
    throw new Error("Usage: node manage-availability.js <uploaded-stock-file.xls> [--dry-run]");
  }

  const { rows: stockRows, products: stockProducts } = parseStockFile(stockFile);
  const stockByMaterial = new Map(stockProducts.map((product) => [product.material, product]));

  if (dryRun) {
    return runDryRun(stockRows, stockProducts, stockByMaterial);
  }

  return runDbSync(stockRows, stockProducts, stockByMaterial);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const stockFile = process.argv.slice(2).find((argument) => !argument.startsWith("--"));

  runStockAvailability(stockFile, { dryRun: DRY_RUN })
    .then((summary) => {
      if (JSON_SUMMARY) console.log(JSON.stringify(summary));
    })
    .catch((error) => {
      console.error("Material availability sync failed.");
      console.error(error);
      process.exit(1);
    });
}
