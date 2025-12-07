import jwt from "jsonwebtoken";
import UserAdmin from "../models/userAdminModel.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "./errorHandler.js";

export const adminAuth = catchAsync(async (req, res, next) => {
  let token = null;

  // 1. Try to get token from cookie (priority)
  if (req.cookies?.adminToken) {
    token = req.cookies.adminToken;
  }
  // 2. Fallback: Get from Authorization header
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.replace("Bearer ", "");
  }

  // 3. No token found
  if (!token) {
    return next(
      new AppError('Admin token tidak ditemukan. Silakan login.', 401)
    );
  }

  // 4. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Silakan login kembali.', 401));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token tidak valid. Silakan login kembali.', 401));
    }
    return next(new AppError('Autentikasi gagal.', 401));
  }

  // 5. Check token type
  if (decoded.type !== 'access') {
    return next(new AppError('Invalid token type', 401));
  }

  // 6. Find user in database
  const admin = await UserAdmin.findById(decoded.id).select('-password');

  if (!admin) {
    return next(new AppError('Admin tidak ditemukan.', 403));
  }

  // 7. Check if password was changed after token was issued
  if (admin.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Password telah diubah. Silakan login kembali.', 401)
    );
  }

  // 8. Check role
  if (admin.role !== 'admin') {
    return next(new AppError('Akses ditolak: Role bukan admin.', 403));
  }

  // 9. Attach admin to request
  req.user = admin;
  next();
});