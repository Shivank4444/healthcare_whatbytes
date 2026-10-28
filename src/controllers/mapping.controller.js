import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';


export const createMapping = asyncHandler(async (req, res) => {
  const { patientId, doctorId } = req.body;

  const patient = await prisma.patient.findFirst({ where: { id: patientId, createdById: req.user.id } });
  if (!patient) return res.status(404).json({ success: false, message: 'Patient not found or not owned by you' });

  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

  const existing = await prisma.patientDoctor.findUnique({
    where: { patientId_doctorId: { patientId, doctorId } },
  });
  if (existing) return res.status(409).json({ success: false, message: 'This doctor is already assigned to the patient' });

  const mapping = await prisma.patientDoctor.create({
    data: { patientId, doctorId, createdById: req.user.id },
    include: { patient: true, doctor: true },
  });
  res.status(201).json({ success: true, message: 'Doctor assigned to patient successfully', data: { mapping } });
});


export const getMappings = asyncHandler(async (req, res) => {
  const mappings = await prisma.patientDoctor.findMany({
    where: { createdById: req.user.id },
    include: { patient: true, doctor: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, count: mappings.length, data: { mappings } });
});


export const getPatientMappings = asyncHandler(async (req, res) => {
  const patient = await prisma.patient.findFirst({
    where: { id: req.params.patientId, createdById: req.user.id },
  });
  if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

  const mappings = await prisma.patientDoctor.findMany({
    where: { patientId: patient.id },
    include: { doctor: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, count: mappings.length, data: { patient, mappings } });
});


export const deleteMapping = asyncHandler(async (req, res) => {
  const mapping = await prisma.patientDoctor.findFirst({
    where: { id: req.params.id, createdById: req.user.id },
  });
  if (!mapping) return res.status(404).json({ success: false, message: 'Mapping not found' });

  await prisma.patientDoctor.delete({ where: { id: mapping.id } });
  res.json({ success: true, message: 'Doctor assignment removed successfully' });
});
