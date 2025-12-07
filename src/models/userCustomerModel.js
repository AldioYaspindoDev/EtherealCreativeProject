import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserCustomerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
      select: false, // Don't include password by default
    },
    nomorhp: {
      type: String,
      required: [true, "Nomor HP is required."],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      default: "customer",
    },
    // 🔒 Account Security Fields
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    // Refresh token tracking
    refreshTokens: [{
      token: String,
      createdAt: { type: Date, default: Date.now },
      expiresAt: Date,
    }],
  },
  {
    timestamps: true,
  }
);

// 🔒 Virtual for checking if account is locked
UserCustomerSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before save
UserCustomerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  
  // Set passwordChangedAt when password is modified (but not on creation)
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 sec for token timing
  }
  
  next();
});

// Compare password
UserCustomerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 🔒 Increment login attempts
UserCustomerSchema.methods.incLoginAttempts = async function () {
  // Reset if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }

  return this.updateOne(updates);
};

// 🔒 Reset login attempts on successful login
UserCustomerSchema.methods.resetLoginAttempts = async function () {
  if (this.loginAttempts === 0 && !this.lockUntil) return;

  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

// Check if password was changed after JWT was issued
UserCustomerSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Add refresh token
UserCustomerSchema.methods.addRefreshToken = async function (token) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  this.refreshTokens.push({
    token,
    expiresAt,
  });

  // Keep only last 5 refresh tokens
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }

  await this.save();
};

// Remove refresh token
UserCustomerSchema.methods.removeRefreshToken = async function (token) {
  this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
  await this.save();
};

// Clean expired refresh tokens
UserCustomerSchema.methods.cleanExpiredTokens = async function () {
  this.refreshTokens = this.refreshTokens.filter(
    rt => rt.expiresAt > Date.now()
  );
  await this.save();
};

// Indexes for performance
UserCustomerSchema.index({ username: 1 });
UserCustomerSchema.index({ nomorhp: 1 });
UserCustomerSchema.index({ lockUntil: 1 });

const UserCustomer = mongoose.model("UserCustomer", UserCustomerSchema);

export default UserCustomer;