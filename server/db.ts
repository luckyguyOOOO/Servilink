import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

// Create a connection to the database
// We use neon-serverless, but with in-memory storage initially
// When ready to move to real DB, this file will need to be updated

export const db = drizzle(neon(process.env.DATABASE_URL || ""), { schema });
