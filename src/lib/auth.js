import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'nirvaya_eyecare_jwt_secret_key_super_secure_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function hashPassword(plainText) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function comparePassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}

export function generateToken(user, role) {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    roleId: role ? role.id : null,
    roleSlug: role ? role.slug : 'guest',
    roleName: role ? role.name : 'Guest',
    permissions: role ? role.permissions : []
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getAuthUser(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}
