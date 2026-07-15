import jwt from "jsonwebtoken";
import UserCustomer from "../models/userCustomerModel.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "./errorHandler.js";

export const customerAuth = catchAsync(async (req, res, next) => {
  let token = null;

  if (req.cookies?.token) {
    token = req.cookies.token;
  }
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.replace("Bearer ", "");
  }

  if (!token) {
    return next(
      new AppError(
        'Akses ditolak. Anda harus login untuk mengakses resource ini.',
        401
      )
    );
  }

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

  // 6. Find user in database (defaultScope sudah exclude password)
  const customer = await UserCustomer.findByPk(decoded.id);

  if (!customer) {
    return next(
      new AppError('Sesi tidak valid: Pengguna tidak ditemukan.', 401)
    );
  }

  // 7. Check if user changed password after token was issued
  if (customer.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Password telah diubah. Silakan login kembali.', 401)
    );
  }

  // 8. Check role
  if (decoded.role !== 'customer') {
    return next(new AppError('Akses ditolak: Role bukan customer.', 403));
  }

  // 9. Attach user to request
  req.user = customer;
  next();
});