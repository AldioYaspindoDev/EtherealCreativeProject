// src/models/portofolioModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Portofolio = sequelize.define('Portofolio', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Keterangan Portofolio Wajib Diisi' },
    },
  },
  gambar: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: null,
  },
  gambarPublicId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    field: 'gambar_public_id',
  },
}, {
  tableName: 'portofolios',
  timestamps: true,
});

export default Portofolio;