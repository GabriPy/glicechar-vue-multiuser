import { getPool } from './db.js';

async function check() {
  try {
    const p = await getPool();
    const [rows]: any = await p.execute('SELECT COUNT(*) as count FROM readings WHERE user_id = 1');
    console.log('Readings for user 1:', rows[0].count);
  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    process.exit();
  }
}

check();
