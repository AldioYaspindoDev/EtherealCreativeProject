// controllers/userCustomerController.js
import UserCustomer, { UserToken } from '../models/userCustomerModel.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../middleware/errorHandler.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  verifyToken,
} from '../utils/authUtils.js';
import { Op } from 'sequelize';

const UserCustomerController = {
  // REGISTER CUSTOMER
  registerCustomer: catchAsync(async (req, res, next) => {
    const { username, password, nomorhp } = req.body;

    // Check if user already exists
    const existing = await UserCustomer.scope('withPassword').findOne({
      where: {
        [Op.or]: [
          { username: username.trim().toLowerCase() },
          { nomorhp: nomorhp.trim() },
        ],
      },
    });

    if (existing) {
      return next(new AppError('Username atau nomor HP sudah digunakan', 400));
    }

    const newCustomer = await UserCustomer.scope('withPassword').create({
      username: username.trim().toLowerCase(),
      password: password.trim(),
      nomorhp: nomorhp.trim(),
    });

    const accessToken  = generateAccessToken(newCustomer.id, 'customer');
    const refreshToken = generateRefreshToken(newCustomer.id, 'customer');

    await newCustomer.addRefreshToken(refreshToken);
    setAuthCookies(res, accessToken, refreshToken, 'customer');

    res.status(201).json({
      success: true,
      message: 'Customer berhasil didaftarkan',
      token: accessToken,
      user: {
        id: newCustomer.id,
        username: newCustomer.username,
        nomorhp: newCustomer.nomorhp,
        role: newCustomer.role,
      },
    });
  }),

  // LOGIN CUSTOMER
  loginCustomer: catchAsync(async (req, res, next) => {
    const { username, password } = req.body;

    const customer = await UserCustomer.scope('withPassword').findOne({
      where: { username: username.trim().toLowerCase() },
    });

    if (!customer) {
      return next(new AppError('Username atau password salah', 401));
    }

    // Check if account is locked
    if (customer.isLocked()) {
      const lockDuration = Math.ceil((customer.lockUntil - Date.now()) / (60 * 1000));
      return next(new AppError(`Akun terkunci. Silakan coba lagi dalam ${lockDuration} menit.`, 423));
    }

    const isMatch = await customer.comparePassword(password.trim());

    if (!isMatch) {
      await customer.incLoginAttempts();
      const attemptsLeft = 5 - (customer.loginAttempts + 1);
      if (attemptsLeft > 0) {
        return next(new AppError(`Username atau password salah. ${attemptsLeft} percobaan tersisa.`, 401));
      } else {
        return next(new AppError('Terlalu banyak percobaan login. Akun dikunci selama 2 jam.', 423));
      }
    }

    await customer.resetLoginAttempts();
    await customer.cleanExpiredTokens();

    const accessToken  = generateAccessToken(customer.id, 'customer');
    const refreshToken = generateRefreshToken(customer.id, 'customer');

    await customer.addRefreshToken(refreshToken);
    setAuthCookies(res, accessToken, refreshToken, 'customer');

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      token: accessToken,
      user: { id: customer.id, username: customer.username, nomorhp: customer.nomorhp, role: customer.role },
    });
  }),

  // REFRESH TOKEN
  refreshToken: catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(new AppError('Refresh token tidak ditemukan', 401));

    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded || decoded.type !== 'refresh') return next(new AppError('Invalid refresh token', 401));

    const customer = await UserCustomer.findByPk(decoded.id);
    if (!customer) return next(new AppError('User tidak ditemukan', 401));

    // Check if token exists in database and not expired
    const tokenRecord = await UserToken.findOne({
      where: {
        userId: customer.id,
        token: refreshToken,
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!tokenRecord) return next(new AppError('Refresh token tidak valid atau expired', 401));

    const newAccessToken = generateAccessToken(customer.id, 'customer');
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: 'Token refreshed successfully', token: newAccessToken });
  }),

  // LOGOUT
  logout: catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken && req.user) {
      await req.user.removeRefreshToken(refreshToken);
    }

    clearAuthCookies(res, 'customer');
    res.status(200).json({ success: true, message: 'Logout berhasil' });
  }),
};

export default UserCustomerController;