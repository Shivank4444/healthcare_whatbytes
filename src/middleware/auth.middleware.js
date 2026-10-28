import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication token is required' });
    }

    const token = authHeader.slice(7).trim();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof payload !== 'object' || !payload.sub) {
      return res.status(401).json({ success: false, message: 'Invalid authentication token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true },
    });
    if (!user) return res.status(401).json({ success: false, message: 'User no longer exists' });

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
    }
    next(error);
  }
}
