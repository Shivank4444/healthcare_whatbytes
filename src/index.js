
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { prisma } from './config/prisma.js';
import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patient.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import mappingRoutes from './routes/mapping.routes.js';

// Validate required environment variables
const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter(
  (key) => !process.env[key]
);

if (missingEnv.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnv.join(', ')}`
  );
  process.exit(1);
}

if (
  process.env.NODE_ENV === 'production' &&
  process.env.JWT_SECRET.length < 32
) {
  console.error(
    'JWT_SECRET must be at least 32 characters in production.'
  );
  process.exit(1);
}

// Initialize Express application
const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health/', (req, res) => {
  res.json({
    success: true,
    message: 'Healthcare API is running',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/mappings', mappingRoutes);

// Start server
const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, () => {
  console.log(
    `Healthcare API listening on http://localhost:${port}`
  );
});

// Graceful shutdown
async function shutdown(signal) {
  console.log(`${signal} received. Closing server...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
