import { db } from "../db/db.js";
import { matches, commentary } from "../db/schema.js";
import { sql } from "drizzle-orm";

async function reset() {
  console.log("🗑️  Deleting all data...");
  
  try {
    await db.delete(commentary);
    await db.delete(matches);
    console.log("✅ Database cleared.");
  } catch (error) {
    console.error("❌ Failed to reset database:", error);
    process.exit(1);
  }
}

reset().then(() => process.exit(0));
