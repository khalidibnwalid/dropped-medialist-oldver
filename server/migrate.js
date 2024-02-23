import 'dotenv/config';
import path, { dirname } from "path";
import Postgrator from "postgrator";
import { fileURLToPath } from "url";
import pool from "./lib/db.js";
import { client } from './lib/db.js';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function main() {
  try {
    await client.connect();

    const migrationsFolder = path.join(__dirname, '/migrations/*')

    // Create postgrator instance
    const postgrator = new Postgrator({
      migrationPattern: migrationsFolder,
      driver: "pg",
      database: process.env.DB_NAME,
      execQuery: (query) => client.query(query),
    });

    // Migrate to specific version
    const appliedMigrations = await postgrator.migrate("001");
    console.log("Applied Migration:", appliedMigrations);

  } catch (error) {
    // error object is decorated with appliedMigrations
    console.error("Migration Error:", error.appliedMigrations); // array of migration objects
  }

  // Once done migrating, close your connection.
  await client.end();
}