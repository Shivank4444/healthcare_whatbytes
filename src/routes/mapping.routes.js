import { Router } from 'express';
import { z } from 'zod';
import { createMapping, getMappings, getPatientMappings, deleteMapping } from '../controllers/mapping.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate, uuidSchema } from '../utils/validation.js';

const createMappingSchema = z.object({ patientId: uuidSchema, doctorId: uuidSchema });
const idSchema = z.object({ id: uuidSchema });
const patientIdSchema = z.object({ patientId: uuidSchema });

const router = Router();
router.use(requireAuth);
router.post('/', validate(createMappingSchema), createMapping);
router.get('/', getMappings);
router.get('/:patientId', validate(patientIdSchema, 'params'), getPatientMappings);
router.delete('/:id', validate(idSchema, 'params'), deleteMapping);
export default router;
