import { z } from 'zod';

export const uuidSchema = z.string().uuid('A valid ID is required');
export const emailSchema = z.string().trim().email('Enter a valid email address').max(255).transform((v) => v.toLowerCase());
export const optionalEmailSchema = z.union([z.literal(''), z.string().trim().email().max(255)]).optional().transform((v) => v || undefined);
export const idParamSchema = z.object({ id: uuidSchema });
export const patientIdParamSchema = z.object({ patientId: uuidSchema });

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    req[source] = result.data;
    next();
  };
}
