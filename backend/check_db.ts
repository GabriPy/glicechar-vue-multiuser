import { getPool } from './db.js';

async function check() {
  try {
    const p = await getPool();
    const [rows] = await p.execute('SELECT id, username, gluroo_token, gluroo_header, gluroo_link FROM users');
    console.log('Users:', rows);
  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    process.exit();
  }
}

check();
