// src/models/userAdminModel.js
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/sequelize.js';

// ─── UserAdmin ────────────────────────────────────────────────────────────────
const UserAdmin = sequelize.define('UserAdmin', {
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
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'admin',
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
}, {
  tableName: 'user_admins',
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: { attributes: {} },
  },
});

// ─── AdminToken (replaces refreshTokens array) ────────────────────────────────
export const AdminToken = sequelize.define('AdminToken', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  adminId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'admin_id',
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
  tableName: 'admin_tokens',
  timestamps: true,
  updatedAt: false,
});

// ─── Associations ─────────────────────────────────────────────────────────────
UserAdmin.hasMany(AdminToken, { foreignKey: 'adminId', as: 'tokens', onDelete: 'CASCADE' });
AdminToken.belongsTo(UserAdmin, { foreignKey: 'adminId' });

// ─── Hooks ────────────────────────────────────────────────────────────────────
UserAdmin.beforeSave(async (admin) => {
  if (admin.changed('password')) {
    const salt = await bcrypt.genSalt(12);
    admin.password = await bcrypt.hash(admin.password, salt);

    if (!admin.isNewRecord) {
      admin.passwordChangedAt = new Date(Date.now() - 1000);
    }
  }
});

// ─── Instance Methods ─────────────────────────────────────────────────────────
UserAdmin.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserAdmin.prototype.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

UserAdmin.prototype.incLoginAttempts = async function () {
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

  // Reset jika lock sudah expired
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

UserAdmin.prototype.resetLoginAttempts = async function () {
  if (this.loginAttempts === 0 && !this.lockUntil) return;
  await this.update({ loginAttempts: 0, lockUntil: null });
};

UserAdmin.prototype.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

UserAdmin.prototype.addRefreshToken = async function (token) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await AdminToken.create({ adminId: this.id, token, expiresAt });

  // Simpan maksimal 5 token terakhir per admin
  const allTokens = await AdminToken.findAll({
    where: { adminId: this.id },
    order: [['id', 'ASC']],
  });
  if (allTokens.length > 5) {
    const toDelete = allTokens.slice(0, allTokens.length - 5);
    await AdminToken.destroy({ where: { id: toDelete.map(t => t.id) } });
  }
};

UserAdmin.prototype.removeRefreshToken = async function (token) {
  await AdminToken.destroy({ where: { adminId: this.id, token } });
};

export default UserAdmin;