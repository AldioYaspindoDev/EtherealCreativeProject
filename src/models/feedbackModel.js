// src/models/feedbackModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  komentar: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Komentar wajib diisi' },
    },
  },
  rating: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Rating minimal 0' },
      max: { args: [5], msg: 'Rating maksimal 5' },
    },
  },
}, {
  tableName: 'feedbacks',
  timestamps: true,
});

export default Feedback;