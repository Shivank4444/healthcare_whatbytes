import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { validate, emailSchema } from '../utils/validation.js';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
});
const loginSchema = z.object({ email: emailSchema, password: z.string().min(1).max(72) });

const router = Router();
router.post('/register/', validate(registerSchema), register);
router.post('/login/', validate(loginSchema), login);
export default router;
