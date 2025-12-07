import UserCustomer from "../models/userCustomerModel.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../middleware/errorHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  verifyToken,
} from "../utils/authUtils.js";

const UserCustomerController = {
  // REGISTER CUSTOMER
  registerCustomer: catchAsync(async (req, res, next) => {
    const { username, password, nomorhp } = req.body;

    // Check if user already exists
    const existing = await UserCustomer.findOne({
      $or: [
        { username: username.trim().toLowerCase() },
        { nomorhp: nomorhp.trim() }
      ]
    });

    if (existing) {
      return next(new AppError('Username atau nomor HP sudah digunakan', 400));
    }

    // Create new customer
    const newCustomer = await UserCustomer.create({
      username: username.trim().toLowerCase(),
      password: password.trim(),
      nomorhp: nomorhp.trim(),
    });

    // Generate tokens
    const accessToken = generateAccessToken(newCustomer._id, 'customer');
    const refreshToken = generateRefreshToken(newCustomer._id, 'customer');

    // Save refresh token to database
    await newCustomer.addRefreshToken(refreshToken);

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken, 'customer');

    res.status(201).json({
      success: true,
      message: "Customer berhasil didaftarkan",
      token: accessToken, // For mobile/SPA fallback
      user: {
        id: newCustomer._id,
        username: newCustomer.username,
        nomorhp: newCustomer.nomorhp,
        role: newCustomer.role
      }
    });
  }),

  // LOGIN CUSTOMER
  loginCustomer: catchAsync(async (req, res, next) => {
    const { username, password } = req.body;

    // Find user with password field
    const customer = await UserCustomer.findOne({
      username: username.trim().toLowerCase(),
    }).select('+password');

    if (!customer) {
      return next(new AppError('Username atau password salah', 401));
    }

    // Check if account is locked
    if (customer.isLocked) {
      const lockDuration = Math.ceil((customer.lockUntil - Date.now()) / (60 * 1000));
      return next(
        new AppError(
          `Akun terkunci. Silakan coba lagi dalam ${lockDuration} menit.`,
          423
        )
      );
    }

    // Verify password
    const isMatch = await customer.comparePassword(password.trim());

    if (!isMatch) {
      // Increment failed login attempts
      await customer.incLoginAttempts();
      
      const attemptsLeft = 5 - (customer.loginAttempts + 1);
      if (attemptsLeft > 0) {
        return next(
          new AppError(
            `Username atau password salah. ${attemptsLeft} percobaan tersisa.`,
            401
          )
        );
      } else {
        return next(
          new AppError(
            'Terlalu banyak percobaan login. Akun dikunci selama 2 jam.',
            423
          )
        );
      }
    }

    // Reset login attempts on successful login
    await customer.resetLoginAttempts();

    // Clean expired refresh tokens
    await customer.cleanExpiredTokens();

    // Generate tokens
    const accessToken = generateAccessToken(customer._id, 'customer');
    const refreshToken = generateRefreshToken(customer._id, 'customer');

    // Save refresh token
    await customer.addRefreshToken(refreshToken);

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken, 'customer');

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      token: accessToken, // For mobile/SPA fallback
      user: {
        id: customer._id,
        username: customer.username,
        nomorhp: customer.nomorhp,
        role: customer.role,
      },
    });
  }),

  // REFRESH TOKEN
  refreshToken: catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new AppError('Refresh token tidak ditemukan', 401));
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decoded || decoded.type !== 'refresh') {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Find user and check if token exists
    const customer = await UserCustomer.findById(decoded.id);

    if (!customer) {
      return next(new AppError('User tidak ditemukan', 401));
    }

    // Check if refresh token exists in database
    const tokenExists = customer.refreshTokens.some(
      rt => rt.token === refreshToken && rt.expiresAt > Date.now()
    );

    if (!tokenExists) {
      return next(new AppError('Refresh token tidak valid atau expired', 401));
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(customer._id, 'customer');

    // Set new access token cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token: newAccessToken,
    });
  }),

  // LOGOUT
  logout: catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken && req.user) {
      // Remove refresh token from database
      await req.user.removeRefreshToken(refreshToken);
    }

    // Clear cookies
    clearAuthCookies(res, 'customer');

    res.status(200).json({
      success: true,
      message: 'Logout berhasil',
    });
  }),
};

export default UserCustomerController;