// server.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import pc from 'picocolors';
import { 
  loginSchema, registerSchema, insulinSchema, carbSchema, 
  noteSchema, settingsSchema, glurooSchema, foodSchema,
  updateAccountSchema, forgotPasswordSchema, resetPasswordSchema
} from './validators.js';

import { 
  getPool, 
  createUser,
  getUserByUsername,
  getUserByEmail,
  countUsers,
  getUserById,
  updateUserAccount,
  setUserResetToken,
  getUserByResetToken,
  resetUserPassword,
  getAllUsers,
  deleteUser,
  toggleAdmin,
  saveRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  getAllUsersWithGluroo,
  updateUserGluroo,
  updateUserSyncError,
  insertReading, 
  getReadingsByMinutes, 
  getLatestReading,
  insertInsulin,
  getInsulinByMinutes,
  deleteInsulin,
  updateInsulin,
  getReadingsByDate,
  getInsulinByDate,
  insertCarb,
  getCarbsByMinutes,
  deleteCarb,
  updateCarb,
  getCarbsByDate,
  getDietFoods,
  insertDietFood,
  insertNote,
  deleteNote,
  updateNote,
  getNotesByMinutes,
  getNotesByDate,
  getSettings,
  updateSettings
} from './db.js';
import { fetchLatestReadings } from './gluroo.js';
import { sendPasswordResetEmail, sendWelcomeEmail } from './mailer.js';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;
const POLL_SECONDS = parseInt(process.env.POLL_INTERVAL_SECONDS || '15', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-it';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

const getTime = () => pc.dim(`${new Date().toLocaleTimeString()} `);

// Estendi l'interfaccia Request per includere l'utente
interface AuthenticatedRequest extends Request {
  user?: any;
}

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());

// Logger HTTP migliorato con picocolors
app.use(morgan((tokens, req, res) => {
  const status = tokens.status(req, res);
  const statusColor = Number(status) >= 400 ? pc.red : Number(status) >= 300 ? pc.yellow : pc.green;
  
  return [
    pc.dim('  [' + new Date().toLocaleTimeString() + ']'),
    pc.bold(pc.blue(tokens.method(req, res).padEnd(7))),
    tokens.url(req, res).padEnd(30),
    statusColor(status),
    pc.dim(tokens['response-time'](req, res).padStart(6) + ' ms')
  ].join(' ');
}));

// Rate limiting disabilitato per permettere un uso libero
/*
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Troppi tentativi, riprova tra 15 minuti' }
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 500, // Aumentato da 100 a 500
  message: { error: 'Troppe richieste, rallenta un po\'' },
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ora
  max: 5, // Solo 5 tentativi falliti per ora per IP
  skipSuccessfulRequests: true,
  message: { error: 'Troppi tentativi falliti, riprova tra un\'ora' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter, strictLimiter);
app.use('/api/auth/register', authLimiter);
*/

// Middleware di autenticazione
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token mancante' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token scaduto', code: 'TOKEN_EXPIRED' });
      }
      return res.status(403).json({ error: 'Token non valido' });
    }
    req.user = user;
    next();
  });
};

// Middleware Admin
const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Accesso negato: richiesti permessi amministratore' });
  }
  next();
};

// Helper per generare i token
const generateTokens = async (user: any) => {
  const payload = { id: user.id, username: user.username, isAdmin: !!user.isAdmin };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  await saveRefreshToken(user.id, refreshToken, expiresAt);
  
  return { accessToken, refreshToken };
};

// ── Serve il frontend buildato ────────────────────────────────────────────────
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');
const FRONTEND_PUBLIC = path.join(__dirname, '..', 'frontend', 'public');

// Rotta specifica per robots.txt (per evitare il fallback HTML)
app.get('/robots.txt', (req, res) => {
  const robotsPath = path.join(FRONTEND_PUBLIC, 'robots.txt');
  res.sendFile(robotsPath);
});

app.use(express.static(FRONTEND_DIST));

// ── API Routes (Auth) ─────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await getUserByUsername(data.username);
    if (existing) return res.status(409).json({ error: 'Username già occupato' });

    const userCount = await countUsers();
    const isAdminUser = userCount === 0;

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userId = await createUser({ 
      username: data.username, 
      password: hashedPassword, 
      email: data.email,
      isAdmin: isAdminUser 
    });
    
    // Invia email di benvenuto (senza attendere, per non rallentare la registrazione)
    if (data.email) {
      sendWelcomeEmail(data.email, data.username);
    }
    
    res.json({ ok: true, userId, isAdmin: isAdminUser });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Dati non validi', details: e.errors });
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await getUserByUsername(data.username);
    if (!user) return res.status(401).json({ error: 'Credenziali non valide' });

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenziali non valide' });

    const { accessToken, refreshToken } = await generateTokens(user);

    res.json({ 
      token: accessToken,
      refreshToken,
      user: { 
        id: user.id, 
        username: user.username, 
        isAdmin: !!user.isAdmin,
        last_sync_error: user.last_sync_error,
        gluroo: {
          token: user.gluroo_token,
          header: user.gluroo_header,
          link: user.gluroo_link
        }
      } 
    });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Dati non validi' });
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Token mancante' });

  try {
    const storedToken = await getRefreshToken(refreshToken);
    if (!storedToken) return res.status(401).json({ error: 'Token non valido o scaduto' });

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err: any, decoded: any) => {
      if (err) {
        await deleteRefreshToken(refreshToken);
        return res.status(403).json({ error: 'Token non valido' });
      }

      const user = await getUserById(decoded.id);
      if (!user) return res.status(404).json({ error: 'Utente non trovato' });

      const accessToken = jwt.sign(
        { id: user.id, username: user.username, isAdmin: !!user.isAdmin }, 
        JWT_SECRET, 
        { expiresIn: '15m' }
      );

      res.json({ token: accessToken });
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/logout', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { refreshToken } = req.body;
  try {
    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
    }
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    res.json({ 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: !!user.isAdmin,
        last_sync_error: user.last_sync_error,
        gluroo: {
          token: user.gluroo_token,
          header: user.gluroo_header,
          link: user.gluroo_link
        }
      }
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await getUserByEmail(email);
    
    // Non riveliamo se l'email esiste o meno per sicurezza
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000); // 1 ora
      await setUserResetToken(user.id, token, expires);
      
      try {
        await sendPasswordResetEmail(email, token, user.username);
        console.log(getTime() + pc.green('✔ ') + pc.bold(`[${user.username}] `) + pc.dim('Email di reset inviata con successo'));
      } catch (mailError: any) {
        console.error(getTime() + pc.red('✖ ') + pc.bold(`[${user.username}] `) + pc.dim('Invio email di reset fallito: ') + mailError.message);
        // In questo caso particolare potremmo voler restituire l'errore all'utente
        // ma per ora manteniamo la risposta generica per sicurezza
      }
    }
    
    res.json({ ok: true, message: 'Se l\'email è presente nei nostri sistemi, riceverai le istruzioni tra poco.' });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Email non valida' });
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    const user = await getUserByResetToken(token);
    
    if (!user) return res.status(400).json({ error: 'Token non valido o scaduto' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await resetUserPassword(user.id, hashedPassword);
    
    res.json({ ok: true, message: 'Password aggiornata correttamente' });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Dati non validi' });
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/auth/account', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = updateAccountSchema.parse(req.body);
    
    // Recupera l'utente attuale per verificare la vecchia password
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    // Verifica se lo username o l'email sono già presi da un altro utente
    const existingUser = await getUserByUsername(data.username);
    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(409).json({ error: 'Username già occupato' });
    }
    
    if (data.email) {
      const existingEmail = await getUserByEmail(data.email);
      if (existingEmail && existingEmail.id !== req.user.id) {
        return res.status(409).json({ error: 'Email già in uso' });
      }
    }

    let hashedPassword = undefined;
    if (data.password) {
      // Se si vuole cambiare password, è obbligatoria la vecchia password
      if (!data.oldPassword) {
        return res.status(400).json({ error: 'Vecchia password obbligatoria per il cambio password' });
      }
      
      const isMatch = await bcrypt.compare(data.oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Vecchia password errata' });
      }
      
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const ok = await updateUserAccount(req.user.id, {
      username: data.username,
      email: data.email,
      password: hashedPassword
    });

    res.json({ ok });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Dati non validi' });
    res.status(500).json({ error: e.message });
  }
});

// ── API Routes (Data) ─────────────────────────────────────────────────────────

app.get('/api/current', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const latest = await getLatestReading(req.user.id);
    if (!latest) return res.status(404).json({ error: 'Nessuna lettura disponibile' });
    res.json(latest);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/readings', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const range = parseInt(req.query.range as string, 10) || 180;
  if (isNaN(range) || range <= 0) return res.status(400).json({ error: 'Range non valido' });
  try {
    const rows = await getReadingsByMinutes(req.user.id, range);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/insulin', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const range = parseInt(req.query.range as string, 10) || 180;
  if (isNaN(range) || range <= 0) return res.status(400).json({ error: 'Range non valido' });
  try {
    const rows = await getInsulinByMinutes(req.user.id, range);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/insulin', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = insulinSchema.parse(req.body);
    const id = await insertInsulin(req.user.id, data);
    res.json({ ok: true, id });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Dati non validi', details: e.errors });
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/insulin/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const ok = await deleteInsulin(req.user.id, parseInt(req.params.id));
    res.json({ ok });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/insulin/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = insulinSchema.parse(req.body);
    const ok = await updateInsulin(req.user.id, parseInt(req.params.id), data);
    res.json({ ok });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Dati non validi', details: e.errors });
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/sync', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user.gluroo_token || !user.gluroo_header || !user.gluroo_link) {
      return res.status(400).json({ error: 'Credenziali Gluroo non configurate' });
    }
    await syncUserReadings(user);
    const latest = await getLatestReading(req.user.id);
    res.json({ ok: true, latest });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/history/readings', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const date = req.query.date as string;
  if (!date) return res.status(400).json({ error: 'Data mancante' });
  try {
    const rows = await getReadingsByDate(req.user.id, date);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/history/insulin', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const date = req.query.date as string;
  if (!date) return res.status(400).json({ error: 'Data mancante' });
  try {
    const rows = await getInsulinByDate(req.user.id, date);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/carbs', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const range = parseInt(req.query.range as string, 10) || 180;
  if (isNaN(range) || range <= 0) return res.status(400).json({ error: 'Range non valido' });
  try {
    const rows = await getCarbsByMinutes(req.user.id, range);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/carbs', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = carbSchema.parse(req.body);
    const id = await insertCarb(req.user.id, data);
    res.json({ ok: true, id });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Dati non validi', details: e.errors });
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/carbs/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const ok = await deleteCarb(req.user.id, parseInt(req.params.id));
    res.json({ ok });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/carbs/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = carbSchema.parse(req.body);
    const ok = await updateCarb(req.user.id, parseInt(req.params.id), data);
    res.json({ ok });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Dati non validi', details: e.errors });
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/history/carbs', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const date = req.query.date as string;
  if (!date) return res.status(400).json({ error: 'Data mancante' });
  try {
    const rows = await getCarbsByDate(req.user.id, date);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/notes', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const range = parseInt(req.query.range as string, 10) || 180;
  if (isNaN(range) || range <= 0) return res.status(400).json({ error: 'Range non valido' });
  try {
    const rows = await getNotesByMinutes(req.user.id, range);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/notes', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = noteSchema.parse(req.body);
    const id = await insertNote(req.user.id, { timestamp: data.timestamp || new Date().toISOString(), text: data.text });
    res.json({ ok: true, id });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Dati non validi', details: e.errors });
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/notes/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = noteSchema.parse(req.body);
    const ok = await updateNote(req.user.id, parseInt(req.params.id), { timestamp: data.timestamp || new Date().toISOString(), text: data.text });
    res.json({ ok });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Dati non validi', details: e.errors });
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/notes/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const ok = await deleteNote(req.user.id, parseInt(req.params.id));
    res.json({ ok });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/history/notes', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const date = req.query.date as string;
  if (!date) return res.status(400).json({ error: 'Data mancante' });
  try {
    const rows = await getNotesByDate(req.user.id, date);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/diet/foods', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const rows = await getDietFoods(req.user.id);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/diet/foods', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = foodSchema.parse(req.body);
    const id = await insertDietFood(req.user.id, data);
    res.json({ ok: true, id });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ error: 'Dati non validi', details: e.errors });
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/settings', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const settings = await getSettings(req.user.id);
    if (!settings) {
      return res.json({
        tir_min: 70,
        tir_max: 180,
        rapid_duration: 3,
        slow_duration: 24,
        carb_duration: 4,
        insulin_sensitivity: 60,
        carb_ratio: 15
      });
    }
    res.json(settings);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/settings', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = settingsSchema.parse(req.body);
    const ok = await updateSettings(req.user.id, data);
    if (!ok) {
      console.log(getTime() + pc.red('✖ ') + pc.bold(`[${req.user.username}] `) + pc.dim('Salvataggio impostazioni fallito (nessuna riga aggiornata)'));
    } else {
      console.log(getTime() + pc.green('✔ ') + pc.bold(`[${req.user.username}] `) + pc.dim('Impostazioni salvate con successo'));
    }
    res.json({ ok });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      console.log(getTime() + pc.yellow('⚠ ') + pc.bold(`[${req.user.username}] `) + pc.dim('Errore validazione impostazioni: ') + JSON.stringify(e.errors));
      return res.status(400).json({ error: 'Dati non validi', details: e.errors });
    }
    console.error(getTime() + pc.red('✖ ') + pc.bold(`[${req.user.username}] `) + pc.dim('Errore interno salvataggio impostazioni: ') + e.message);
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/user/gluroo', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = glurooSchema.parse(req.body);
    const ok = await updateUserGluroo(req.user.id, data);
    if (ok) {
      console.log(getTime() + pc.green('✔ ') + pc.bold(`[${req.user.username}] `) + pc.dim('Credenziali Gluroo salvate'));
      // Forza una sincronizzazione immediata per questo utente
      const user = await getUserById(req.user.id);
      if (user) {
        console.log(getTime() + pc.cyan(`🔄 [${user.username}] `) + pc.dim('Sincronizzazione forzata dopo aggiornamento credenziali...'));
        syncUserReadings(user); 
      }
    } else {
      console.log(getTime() + pc.red('✖ ') + pc.bold(`[${req.user.username}] `) + pc.dim('Salvataggio credenziali Gluroo fallito'));
    }
    res.json({ ok });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      console.log(getTime() + pc.yellow('⚠ ') + pc.bold(`[${req.user.username}] `) + pc.dim('Errore validazione Gluroo: ') + JSON.stringify(e.errors));
      return res.status(400).json({ error: 'Dati non validi', details: e.errors });
    }
    console.error(getTime() + pc.red('✖ ') + pc.bold(`[${req.user.username}] `) + pc.dim('Errore interno salvataggio Gluroo: ') + e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── Admin Routes ─────────────────────────────────────────────────────────────

app.get('/api/admin/users', authenticateToken, isAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, isAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const targetId = parseInt(req.params.id);
    if (targetId === req.user.id) {
      return res.status(400).json({ error: 'Non puoi eliminare te stesso' });
    }
    const ok = await deleteUser(targetId);
    res.json({ ok });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/admin/users/:id/admin', authenticateToken, isAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const targetId = parseInt(req.params.id);
    const { isAdmin: targetIsAdmin } = req.body;
    
    if (targetId === req.user.id) {
      return res.status(400).json({ error: 'Non puoi cambiare i tuoi permessi' });
    }
    
    const ok = await toggleAdmin(targetId, targetIsAdmin);
    res.json({ ok });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});

// ── Sync function ─────────────────────────────────────────────────────────────

async function syncUserReadings(user: any) {
  if (!user.gluroo_token || !user.gluroo_header || !user.gluroo_link) {
    console.log(getTime() + pc.yellow(`⚠ [${user.username}] `) + pc.dim('Sync saltata: credenziali non configurate'));
    await updateUserSyncError(user.id, 'Credenziali Gluroo non configurate');
    return;
  }
  try {
    const readings = await fetchLatestReadings(user.gluroo_token, user.gluroo_header, user.gluroo_link);
    let nuove = 0;
    for (const r of readings) {
      if (await insertReading(user.id, r)) nuove++;
    }
    
    if (nuove > 0) {
      console.log(getTime() + pc.green(`✔ [${user.username}] `) + pc.bold(`${nuove} nuove letture`) + pc.dim(` (${readings.length} totali)`));
    }
    
    if (user.last_sync_error) {
      await updateUserSyncError(user.id, '');
    }
  } catch (e: any) {
    console.log(getTime() + pc.red(`✖ [${user.username}] `) + pc.bold('Sync fallita: ') + pc.dim(e.message));
    await updateUserSyncError(user.id, 'Credenziali non inserite o errate');
  }
}

async function syncAllUsers() {
  const start = Date.now();
  try {
    const users = await getAllUsersWithGluroo();
    if (users.length > 0) {
      for (const user of users) {
        await syncUserReadings(user);
      }
    }
  } catch (e: any) {
    console.log(getTime() + pc.red('✖ ') + pc.bold('Errore sync globale: ') + pc.dim(e.message));
  }
}

// ── Avvio ─────────────────────────────────────────────────────────────────────

async function start() {
  console.log(pc.cyan(pc.bold('\n  🚀 GliceChart ')) + pc.dim('v1.2.0\n'));
  
  await getPool();

  app.listen(PORT, () => {
    console.log(getTime() + pc.magenta('📡 Server: ') + pc.bold(`http://localhost:${PORT}`));
    console.log(getTime() + pc.magenta('🕒 Polling: ') + pc.bold(`${POLL_SECONDS}s\n`));
    console.log(pc.dim('  ' + '─'.repeat(50) + '\n'));
  });

  await syncAllUsers();
  setInterval(syncAllUsers, POLL_SECONDS * 1000);
}

start().catch(err => {
  console.error('Errore avvio:', err);
  process.exit(1);
});
