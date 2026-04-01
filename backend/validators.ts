import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().transform(v => v === '' ? undefined : v).pipe(z.string().email().optional()),
  timezone: z.string().min(1).optional().default('Europe/Rome'),
});

export const updateAccountSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(6).optional().or(z.literal('')),
  oldPassword: z.string().optional().or(z.literal('')),
  timezone: z.string().min(1).optional().default('Europe/Rome'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

export const insulinSchema = z.object({
  timestamp: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)),
  type: z.enum(['rapid', 'slow']),
  units: z.number().positive().max(100),
});

export const carbSchema = z.object({
  timestamp: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)),
  amount: z.number().int().positive().max(500),
  speed: z.enum(['fast', 'normal', 'slow']).optional().default('normal'),
});

export const noteSchema = z.object({
  timestamp: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)).optional(),
  text: z.string().min(1).max(200),
});

export const settingsSchema = z.object({
  tir_min: z.number().int().min(40).max(150).optional(),
  tir_max: z.number().int().min(120).max(300).optional(),
  red_under: z.number().int().min(30).max(100).optional(),
  red_over: z.number().int().min(150).max(400).optional(),
  rapid_duration: z.number().min(1).max(8).optional(),
  slow_duration: z.number().min(6).max(48).optional(),
  carb_duration: z.number().min(1).max(12).optional(),
  insulin_sensitivity: z.number().min(10).max(200).optional(),
  carb_ratio: z.number().min(1).max(100).optional(),
});

export const glurooSchema = z.object({
  token: z.string().min(1),
  header: z.string().min(1),
  link: z.string().min(1).transform(v => {
    if (!v.startsWith('http://') && !v.startsWith('https://')) {
      return `https://${v}`;
    }
    return v;
  }).pipe(z.string().url()),
});

export const foodSchema = z.object({
  name: z.string().min(1).max(100),
  carbs_per_100g: z.number().int().min(0).max(100),
  category: z.enum(['primo', 'secondo', 'contorno', 'frutta']).optional(),
});
