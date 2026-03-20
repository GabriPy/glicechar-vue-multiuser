// db.ts - Connessione e query MySQL
import mysql, { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pc from 'picocolors';

let pool: Pool | null = null;

// Crea il pool di connessioni (viene riutilizzato per tutta la vita del server)
export async function getPool(): Promise<Pool> {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT || '3306'),
      user:     process.env.DB_USER     || 'glucoview',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME     || 'glicechart-multiutente',
      waitForConnections: true,
      connectionLimit: 10,
    });

    await initDB();
  }
  return pool;
}

// Crea la tabella se non esiste
async function initDB() {
  if (!pool) return;
  const conn = await pool.getConnection();
  try {
    // Tabella Utenti
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        username      VARCHAR(50) NOT NULL UNIQUE,
        password      VARCHAR(255) NOT NULL,
        email         VARCHAR(100) UNIQUE,
        reset_token   VARCHAR(255),
        reset_expires DATETIME,
        isAdmin       BOOLEAN DEFAULT FALSE,
        gluroo_token  VARCHAR(255),
        gluroo_header VARCHAR(255),
        gluroo_link   VARCHAR(255),
        last_sync_error VARCHAR(255),
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migrazioni: Aggiunge le colonne se non esistono
    try { await conn.execute(`ALTER TABLE users ADD COLUMN email VARCHAR(100) UNIQUE AFTER password`); } catch (e) {}
    try { await conn.execute(`ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) AFTER email`); } catch (e) {}
    try { await conn.execute(`ALTER TABLE users ADD COLUMN reset_expires DATETIME AFTER reset_token`); } catch (e) {}
    try { await conn.execute(`ALTER TABLE users ADD COLUMN last_sync_error VARCHAR(255) AFTER gluroo_link`); } catch (e) {}

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS readings (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    INT NOT NULL,
        timestamp  DATETIME NOT NULL,
        glucose    INT NOT NULL,
        trend      VARCHAR(20) NOT NULL,
        raw_trend  VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_timestamp (user_id, timestamp),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS insulin_records (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    INT NOT NULL,
        timestamp  DATETIME NOT NULL,
        type       ENUM('rapid', 'slow') NOT NULL,
        units      DECIMAL(4,1) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_timestamp (user_id, timestamp),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS carb_records (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    INT NOT NULL,
        timestamp  DATETIME NOT NULL,
        amount     INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_timestamp (user_id, timestamp),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        user_id             INT PRIMARY KEY,
        tir_min             INT DEFAULT 70,
        tir_max             INT DEFAULT 180,
        rapid_duration      INT DEFAULT 3,
        slow_duration       INT DEFAULT 24,
        carb_duration       INT DEFAULT 4,
        insulin_sensitivity INT DEFAULT 60,
        carb_ratio          INT DEFAULT 15,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS notes (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    INT NOT NULL,
        timestamp  DATETIME NOT NULL,
        text       VARCHAR(200) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_timestamp (user_id, timestamp),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS diet_foods (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        user_id        INT, -- NULL per cibi globali
        name           VARCHAR(100) NOT NULL,
        carbs_per_100g INT NOT NULL,
        category       ENUM('primo', 'secondo', 'contorno', 'frutta') DEFAULT 'contorno',
        created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_name (user_id, name),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    INT NOT NULL,
        token      VARCHAR(512) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token)
      )
    `);

    // Inserisce cibi globali (user_id = NULL) se non esistono già
    const foods = [
      { name: 'Pasta', carbs: 70, cat: 'primo' },
      { name: 'Riso', carbs: 80, cat: 'primo' },
      { name: 'Pane', carbs: 50, cat: 'contorno' },
      { name: 'Pesca', carbs: 9, cat: 'frutta' }
    ];

    for (const f of foods) {
      const [existing] = await conn.execute<RowDataPacket[]>(
        `SELECT id FROM diet_foods WHERE user_id IS NULL AND name = ?`,
        [f.name]
      );

      if (existing.length === 0) {
        await conn.execute(
          `INSERT INTO diet_foods (user_id, name, carbs_per_100g, category) VALUES (NULL, ?, ?, ?)`,
          [f.name, f.carbs, f.cat]
        );
      }
    }

    const time = pc.dim(`${new Date().toLocaleTimeString()} `);
    console.log(time + pc.green('✔ ') + pc.bold('Database MySQL inizializzato correttamente'));
  } finally {
    conn.release();
  }
}

// ── Funzioni Utente ──────────────────────────────────────────────────────────

export async function createUser({ username, password, email, isAdmin = false }: any) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `INSERT INTO users (username, password, email, isAdmin) VALUES (?, ?, ?, ?)`,
    [username, password, email || null, isAdmin]
  );
  const userId = result.insertId;
  
  await p.execute(
    `INSERT INTO settings (user_id) VALUES (?)`,
    [userId]
  );
  
  return userId;
}

export async function getUserByUsername(username: string) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  );
  return rows[0];
}

export async function getUserByEmail(email: string) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  return rows[0];
}

export async function countUsers() {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(`SELECT COUNT(*) as count FROM users`);
  return rows[0].count;
}

export async function getUserById(id: number) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, username, email, isAdmin, gluroo_token, gluroo_header, gluroo_link, last_sync_error FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
}

export async function updateUserAccount(userId: number, { username, email, password }: any) {
  const p = await getPool();
  let query = `UPDATE users SET username = ?, email = ?`;
  const params: any[] = [username, email || null];

  if (password) {
    query += `, password = ?`;
    params.push(password);
  }

  query += ` WHERE id = ?`;
  params.push(userId);

  const [result] = await p.execute<ResultSetHeader>(query, params);
  return result.affectedRows > 0;
}

export async function setUserResetToken(userId: number, token: string, expires: Date) {
  const p = await getPool();
  await p.execute(
    `UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?`,
    [token, expires, userId]
  );
}

export async function getUserByResetToken(token: string) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()`,
    [token]
  );
  return rows[0];
}

export async function resetUserPassword(userId: number, hashedPassword: any) {
  const p = await getPool();
  await p.execute(
    `UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?`,
    [hashedPassword, userId]
  );
}

export async function getAllUsersWithGluroo() {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, username, gluroo_token, gluroo_header, gluroo_link, last_sync_error 
     FROM users 
     WHERE gluroo_token IS NOT NULL AND gluroo_header IS NOT NULL AND gluroo_link IS NOT NULL`
  );
  return rows;
}

export async function updateUserGluroo(userId: number, { token, header, link }: any) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `UPDATE users SET gluroo_token = ?, gluroo_header = ?, gluroo_link = ?, last_sync_error = NULL WHERE id = ?`,
    [token, header, link, userId]
  );
  return result.affectedRows > 0;
}

export async function updateUserSyncError(userId: number, error: string) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `UPDATE users SET last_sync_error = ? WHERE id = ?`,
    [error, userId]
  );
  return result.affectedRows > 0;
}

// ── Funzioni Dati (con user_id) ───────────────────────────────────────────────

export async function insertReading(userId: number, { timestamp, glucose, trend, raw_trend }: any) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `INSERT INTO readings (user_id, timestamp, glucose, trend, raw_trend)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE 
     glucose = VALUES(glucose),
     trend = VALUES(trend),
     raw_trend = VALUES(raw_trend)`,
    [userId, new Date(timestamp), glucose, trend, raw_trend]
  );
  return result.affectedRows > 0;
}

export async function getReadingsByMinutes(userId: number, minutes: number) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, timestamp, glucose, trend
     FROM readings
     WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
     ORDER BY timestamp ASC`,
    [userId, minutes]
  );
  return rows.map(r => ({
    ...r,
    timestamp: new Date(r.timestamp).toISOString(),
  }));
}

export async function getLatestReading(userId: number) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, timestamp, glucose, trend
     FROM readings
     WHERE user_id = ?
     ORDER BY timestamp DESC
     LIMIT 1`,
    [userId]
  );
  if (!rows.length) return null;
  return {
    ...rows[0],
    timestamp: new Date(rows[0].timestamp).toISOString(),
  };
}

export async function insertInsulin(userId: number, { timestamp, type, units }: any) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `INSERT INTO insulin_records (user_id, timestamp, type, units)
     VALUES (?, ?, ?, ?)`,
    [userId, new Date(timestamp), type, units]
  );
  return result.insertId;
}

export async function getInsulinByMinutes(userId: number, minutes: number) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, timestamp, type, units
     FROM insulin_records
     WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
     ORDER BY timestamp ASC`,
    [userId, minutes]
  );
  return rows.map(r => ({
    ...r,
    timestamp: new Date(r.timestamp).toISOString(),
  }));
}

export async function deleteInsulin(userId: number, id: number) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `DELETE FROM insulin_records WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return result.affectedRows > 0;
}

export async function updateInsulin(userId: number, id: number, { timestamp, type, units }: any) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `UPDATE insulin_records 
     SET timestamp = ?, type = ?, units = ?
     WHERE id = ? AND user_id = ?`,
    [new Date(timestamp), type, units, id, userId]
  );
  return result.affectedRows > 0;
}

export async function getReadingsByDate(userId: number, date: string) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, timestamp, glucose, trend
     FROM readings
     WHERE user_id = ? AND DATE(timestamp) = ?
     ORDER BY timestamp ASC`,
    [userId, date]
  );
  return rows.map(r => ({
    ...r,
    timestamp: new Date(r.timestamp).toISOString(),
  }));
}

export async function getInsulinByDate(userId: number, date: string) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, timestamp, type, units
     FROM insulin_records
     WHERE user_id = ? AND DATE(timestamp) = ?
     ORDER BY timestamp ASC`,
    [userId, date]
  );
  return rows.map(r => ({
    ...r,
    timestamp: new Date(r.timestamp).toISOString(),
  }));
}

export async function insertCarb(userId: number, { timestamp, amount }: any) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `INSERT INTO carb_records (user_id, timestamp, amount) VALUES (?, ?, ?)`,
    [userId, new Date(timestamp), amount]
  );
  return result.insertId;
}

export async function getCarbsByMinutes(userId: number, minutes: number) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, timestamp, amount
     FROM carb_records
     WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
     ORDER BY timestamp ASC`,
    [userId, minutes]
  );
  return rows.map(r => ({
    ...r,
    timestamp: new Date(r.timestamp).toISOString(),
  }));
}

export async function deleteCarb(userId: number, id: number) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(`DELETE FROM carb_records WHERE id = ? AND user_id = ?`, [id, userId]);
  return result.affectedRows > 0;
}

export async function updateCarb(userId: number, id: number, { timestamp, amount }: any) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `UPDATE carb_records SET timestamp = ?, amount = ? WHERE id = ? AND user_id = ?`,
    [new Date(timestamp), amount, id, userId]
  );
  return result.affectedRows > 0;
}

export async function getCarbsByDate(userId: number, date: string) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, timestamp, amount
     FROM carb_records
     WHERE user_id = ? AND DATE(timestamp) = ?
     ORDER BY timestamp ASC`,
    [userId, date]
  );
  return rows.map(r => ({
    ...r,
    timestamp: new Date(r.timestamp).toISOString(),
  }));
}

export async function insertNote(userId: number, { timestamp, text }: any) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `INSERT INTO notes (user_id, timestamp, text) VALUES (?, ?, ?)`,
    [userId, new Date(timestamp), text]
  );
  return result.insertId;
}

export async function getNotesByMinutes(userId: number, minutes: number) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, timestamp, text
     FROM notes
     WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
     ORDER BY timestamp ASC`,
    [userId, minutes]
  );
  return rows.map(r => ({
    ...r,
    timestamp: new Date(r.timestamp).toISOString(),
  }));
}

export async function deleteNote(userId: number, id: number) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(`DELETE FROM notes WHERE id = ? AND user_id = ?`, [id, userId]);
  return result.affectedRows > 0;
}

export async function updateNote(userId: number, id: number, { timestamp, text }: any) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `UPDATE notes SET timestamp = ?, text = ? WHERE id = ? AND user_id = ?`,
    [new Date(timestamp), text, id, userId]
  );
  return result.affectedRows > 0;
}

export async function getNotesByDate(userId: number, date: string) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, timestamp, text
     FROM notes
     WHERE user_id = ? AND DATE(timestamp) = ?
     ORDER BY timestamp ASC`,
    [userId, date]
  );
  return rows.map(r => ({
    ...r,
    timestamp: new Date(r.timestamp).toISOString(),
  }));
}

export async function getDietFoods(userId: number) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, name, carbs_per_100g, category FROM diet_foods WHERE user_id = ?
     UNION
     SELECT id, name, carbs_per_100g, category FROM diet_foods WHERE user_id IS NULL 
     AND name NOT IN (SELECT name FROM diet_foods WHERE user_id = ?)
     ORDER BY category ASC, name ASC`,
    [userId, userId]
  );
  return rows;
}

export async function insertDietFood(userId: number, { name, carbs_per_100g, category }: any) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `INSERT INTO diet_foods (user_id, name, carbs_per_100g, category) VALUES (?, ?, ?, ?)`,
    [userId, name, carbs_per_100g, category || 'contorno']
  );
  return result.insertId;
}

export async function getSettings(userId: number) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(`SELECT * FROM settings WHERE user_id = ?`, [userId]);
  return rows[0];
}

export async function updateSettings(userId: number, { tir_min, tir_max, rapid_duration, slow_duration, carb_duration, insulin_sensitivity, carb_ratio }: any) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(
    `UPDATE settings 
     SET tir_min = ?, tir_max = ?, rapid_duration = ?, slow_duration = ?, carb_duration = ?, insulin_sensitivity = ?, carb_ratio = ?
     WHERE user_id = ?`,
    [tir_min, tir_max, rapid_duration, slow_duration, carb_duration, insulin_sensitivity, carb_ratio, userId]
  );
  return result.affectedRows > 0;
}

export async function getAllUsers() {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT id, username, isAdmin, gluroo_token, gluroo_header, gluroo_link, last_sync_error, created_at FROM users ORDER BY id ASC`
  );
  return rows;
}

export async function deleteUser(userId: number) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(`DELETE FROM users WHERE id = ?`, [userId]);
  return result.affectedRows > 0;
}

export async function toggleAdmin(userId: number, isAdmin: boolean) {
  const p = await getPool();
  const [result] = await p.execute<ResultSetHeader>(`UPDATE users SET isAdmin = ? WHERE id = ?`, [isAdmin ? 1 : 0, userId]);
  return result.affectedRows > 0;
}

// ── Funzioni Refresh Token ──────────────────────────────────────────────────

export async function saveRefreshToken(userId: number, token: string, expiresAt: Date) {
  const p = await getPool();
  await p.execute(
    `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`,
    [userId, token, expiresAt]
  );
}

export async function getRefreshToken(token: string) {
  const p = await getPool();
  const [rows] = await p.execute<RowDataPacket[]>(
    `SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()`,
    [token]
  );
  return rows[0];
}

export async function deleteRefreshToken(token: string) {
  const p = await getPool();
  await p.execute(`DELETE FROM refresh_tokens WHERE token = ?`, [token]);
}

export async function deleteUserRefreshTokens(userId: number) {
  const p = await getPool();
  await p.execute(`DELETE FROM refresh_tokens WHERE user_id = ?`, [userId]);
}
