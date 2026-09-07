import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = process.env.DATABASE_PATH || path.resolve(process.cwd(), 'data', 'campuspulse.db');
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  dbInstance = new Database(dbPath, {
    verbose: process.env.NODE_ENV === 'development' ? undefined : undefined
  });

  // Enable foreign keys and WAL mode for reliability and performance
  dbInstance.pragma('foreign_keys = ON');
  dbInstance.pragma('journal_mode = WAL');

  return dbInstance;
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
