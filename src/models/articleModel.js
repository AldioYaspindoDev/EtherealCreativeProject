// src/models/articleModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  judulArtikel: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'judul_artikel',
    validate: {
      notEmpty: { msg: 'Judul artikel wajib diisi.' },
    },
  },
  isiArtikel: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    field: 'isi_artikel',
    validate: {
      notEmpty: { msg: 'Isi artikel wajib diisi.' },
    },
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: null,
    field: 'image_url',
    validate: {
      isUrl: { msg: 'URL gambar tidak valid.' },
    },
  },
}, {
  tableName: 'articles',
  timestamps: true,
  indexes: [
    { fields: ['judul_artikel'] },
  ],
});

export default Article;
