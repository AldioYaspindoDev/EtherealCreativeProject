// utils/authUtils.js - JWT Token Management
import jwt from "jsonwebtoken";

// Generate Access Token
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

// Generate Refresh Token
export const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

// Verify Token
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

// Set Secure Cookies
export const setAuthCookies = (res, accessToken, refreshToken, role) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'none', // ✅ Protection against CSRF
    path: '/',
  };

  // Access Token Cookie (15 minutes)
  res.cookie(
    role === 'admin' ? 'adminToken' : 'token',
    accessToken,
    {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    }
  );

  // Refresh Token Cookie (7 days)
  res.cookie(
    role === 'admin' ? 'adminRefreshToken' : 'refreshToken',
    refreshToken,
    {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
  );
};

// Clear Auth Cookies
export const clearAuthCookies = (res, role) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  };

  res.clearCookie(role === 'admin' ? 'adminToken' : 'token', cookieOptions);
  res.clearCookie(
    role === 'admin' ? 'adminRefreshToken' : 'refreshToken',
    cookieOptions
  );
};