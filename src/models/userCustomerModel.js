// src/models/userCustomerModel.js
import { DataTypes, Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/sequelize.js';

// ─── UserCustomer ─────────────────────────────────────────────────────────────
const UserCustomer = sequelize.define('UserCustomer', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Username is required.' },
    },
    set(value) {
      this.setDataValue('username', value?.trim().toLowerCase());
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: { args: [8, 255], msg: 'Password must be at least 8 characters long.' },
    },
  },
  nomorhp: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    field: 'nomorhp',
    validate: {
      notEmpty: { msg: 'Nomor HP is required.' },
    },
    set(value) {
      this.setDataValue('nomorhp', value?.trim());
    },
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'customer',
  },
  loginAttempts: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'login_attempts',
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'lock_until',
  },
  passwordChangedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'password_changed_at',
  },
  passwordResetToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'password_reset_token',
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'password_reset_expires',
  },
}, {
  tableName: 'user_customers',
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: { attributes: {} },
  },
});

// ─── UserToken (replaces refreshTokens array) ─────────────────────────────────
export const UserToken = sequelize.define('UserToken', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'user_id',
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at',
  },
}, {
  tableName: 'user_tokens',
  timestamps: true,
  updatedAt: false,
});

// ─── Associations ─────────────────────────────────────────────────────────────
UserCustomer.hasMany(UserToken, { foreignKey: 'userId', as: 'tokens', onDelete: 'CASCADE' });
UserToken.belongsTo(UserCustomer, { foreignKey: 'userId' });

// ─── Hooks ────────────────────────────────────────────────────────────────────
UserCustomer.beforeSave(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);

    if (!user.isNewRecord) {
      user.passwordChangedAt = new Date(Date.now() - 1000);
    }
  }
});

// ─── Instance Methods ─────────────────────────────────────────────────────────
UserCustomer.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserCustomer.prototype.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

UserCustomer.prototype.incLoginAttempts = async function () {
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

  if (this.lockUntil && this.lockUntil < Date.now()) {
    await this.update({ loginAttempts: 1, lockUntil: null });
    return;
  }

  const newAttempts = this.loginAttempts + 1;
  const updates = { loginAttempts: newAttempts };

  if (newAttempts >= MAX_ATTEMPTS && !this.isLocked()) {
    updates.lockUntil = new Date(Date.now() + LOCK_TIME);
  }

  await this.update(updates);
};

UserCustomer.prototype.resetLoginAttempts = async function () {
  if (this.loginAttempts === 0 && !this.lockUntil) return;
  await this.update({ loginAttempts: 0, lockUntil: null });
};

UserCustomer.prototype.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

UserCustomer.prototype.addRefreshToken = async function (token) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await UserToken.create({ userId: this.id, token, expiresAt });

  // Simpan maksimal 5 token terakhir per user
  const allTokens = await UserToken.findAll({
    where: { userId: this.id },
    order: [['id', 'ASC']],
  });
  if (allTokens.length > 5) {
    const toDelete = allTokens.slice(0, allTokens.length - 5);
    await UserToken.destroy({ where: { id: toDelete.map(t => t.id) } });
  }
};

UserCustomer.prototype.removeRefreshToken = async function (token) {
  await UserToken.destroy({ where: { userId: this.id, token } });
};

UserCustomer.prototype.cleanExpiredTokens = async function () {
  await UserToken.destroy({
    where: {
      userId: this.id,
      expiresAt: { [Op.lt]: new Date() },
    },
  });
};

export default UserCustomer;