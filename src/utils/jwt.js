import jwt from 'jsonwebtoken';

const PRIVATE_KEY = process.env.JWT_SECRET || 'secretkey';

export const generateToken = (user) => {
  const payload = {
    id: user._id || user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, PRIVATE_KEY);
};