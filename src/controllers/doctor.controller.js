import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';


export const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await prisma.doctor.create({ data: { ...req.body, createdById: req.user.id } });
  res.status(201).json({ success: true, message: 'Doctor created successfully', data: { doctor } });
});


export const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await prisma.doctor.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { mappings: true } } },
  });
  res.json({ success: true, count: doctors.length, data: { doctors } });
});


export const getDoctor = asyncHandler(async (req, res) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { mappings: true } } },
  });
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
  res.json({ success: true, data: { doctor } });
});


export const updateDoctor = asyncHandler(async (req, res) => {
  const existing = await prisma.doctor.findFirst({ where: { id: req.params.id, createdById: req.user.id } });
  if (!existing) return res.status(404).json({ success: false, message: 'Doctor not found or you do not own this record' });

  const doctor = await prisma.doctor.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, message: 'Doctor updated successfully', data: { doctor } });
});


export const deleteDoctor = asyncHandler(async (req, res) => {
  const existing = await prisma.doctor.findFirst({ where: { id: req.params.id, createdById: req.user.id } });
  if (!existing) return res.status(404).json({ success: false, message: 'Doctor not found or you do not own this record' });

  await prisma.doctor.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Doctor deleted successfully' });
});
