import { getDatabase } from '../connection';
import { User, UserRole } from '../../types';

export class UserRepository {
  static findById(id: string): User | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
    return row || null;
  }

  static findByEmail(email: string): User | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
    return row || null;
  }

  static create(user: { id: string; name: string; email: string; role?: UserRole }): User {
    const db = getDatabase();
    const role = user.role || 'student';
    db.prepare(`
      INSERT INTO users (id, name, email, role, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).run(user.id, user.name, user.email, role);

    return this.findById(user.id)!;
  }
}
