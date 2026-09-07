import fs from 'fs';
import path from 'path';
import { getDatabase } from './connection';

export function initializeDatabase(): void {
  const db = getDatabase();
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Execute schema DDL
  db.exec(schemaSql);

  // Seed default users if table is empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, role, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    insertUser.run('usr_student_01', 'Alex Johnson', 'alex.student@campus.edu', 'student');
    insertUser.run('usr_student_02', 'Sam Rivera', 'sam.student@campus.edu', 'student');
    insertUser.run('usr_admin_01', 'Dr. Sarah Patel (Campus Operations)', 'admin@campus.edu', 'admin');
    console.log('[Database] Seeded 3 default users.');
  }

  console.log('[Database] Schema initialized successfully.');
}

// Allow direct execution: tsx src/db/init.ts
if (process.argv[1]?.endsWith('init.ts') || process.argv[1]?.endsWith('init.js')) {
  try {
    initializeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('[Database] Initialization error:', error);
    process.exit(1);
  }
}
