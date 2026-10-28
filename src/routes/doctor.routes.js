import { Router } from 'express';
import { z } from 'zod';
import { createDoctor, getDoctors, getDoctor, updateDoctor, deleteDoctor } from '../controllers/doctor.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate, uuidSchema, optionalEmailSchema } from '../utils/validation.js';

const doctorSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: optionalEmailSchema,
  phone: z.string().trim().max(30).optional(),
  specialization: z.string().trim().min(2).max(120),
  licenseNumber: z.string().trim().max(100).optional(),
  clinicAddress: z.string().trim().max(500).optional(),
});
const idSchema = z.object({ id: uuidSchema });

const router = Router();
router.use(requireAuth);
router.post('/', validate(doctorSchema), createDoctor);
router.get('/', getDoctors);
router.get('/:id', validate(idSchema, 'params'), getDoctor);
router.put('/:id', validate(idSchema, 'params'), validate(doctorSchema), updateDoctor);
router.delete('/:id', validate(idSchema, 'params'), deleteDoctor);
export default router;
