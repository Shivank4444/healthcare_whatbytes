import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';


export const createPatient = asyncHandler(async (req, res) => {
  const patient = await prisma.patient.create({
    data: { ...req.body, createdById: req.user.id },
  });
  res.status(201).json({ success: true, message: 'Patient created successfully', data: { patient } });
});


export const getPatients = asyncHandler(async (req, res) => {
  const patients = await prisma.patient.findMany({
    where: { createdById: req.user.id },
    include: { mappings: { include: { doctor: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, count: patients.length, data: { patients } });
});


export const getPatient = asyncHandler(async (req, res) => {
  const patient = await prisma.patient.findFirst({
    where: { id: req.params.id, createdById: req.user.id },
    include: { mappings: { include: { doctor: true } } },
  });
  if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
  res.json({ success: true, data: { patient } });
});


export const updatePatient = asyncHandler(async (req, res) => {
  const existing = await prisma.patient.findFirst({ where: { id: req.params.id, createdById: req.user.id } });
  if (!existing) return res.status(404).json({ success: false, message: 'Patient not found' });

  const patient = await prisma.patient.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ success: true, message: 'Patient updated successfully', data: { patient } });
});


export const deletePatient = asyncHandler(async (req, res) => {
  const existing = await prisma.patient.findFirst({ where: { id: req.params.id, createdById: req.user.id } });
  if (!existing) return res.status(404).json({ success: false, message: 'Patient not found' });

  await prisma.patient.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Patient deleted successfully' });
});
