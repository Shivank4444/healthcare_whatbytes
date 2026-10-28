import { Router } from 'express';
import { z } from 'zod';
import { createPatient, getPatients, getPatient, updatePatient, deletePatient } from '../controllers/patient.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate, uuidSchema, optionalEmailSchema } from '../utils/validation.js';

const genderSchema = z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']);
const patientCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  dateOfBirth: z.coerce.date().optional().nullable(),
  gender: genderSchema.optional().nullable(),
  email: optionalEmailSchema,
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(2000).optional(),
});
const patientUpdateSchema = patientCreateSchema;
const idSchema = z.object({ id: uuidSchema });

const router = Router();
router.use(requireAuth);
router.post('/', validate(patientCreateSchema), createPatient);
router.get('/', getPatients);
router.get('/:id', validate(idSchema, 'params'), getPatient);
router.put('/:id', validate(idSchema, 'params'), validate(patientUpdateSchema), updatePatient);
router.delete('/:id', validate(idSchema, 'params'), deletePatient);
export default router;
