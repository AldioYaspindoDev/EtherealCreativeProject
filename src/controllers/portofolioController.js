// controllers/portofolioController.js
import Portofolio from '../models/portofolioModel.js';
import fs from 'fs';
import path from 'path';

const portofolioController = {
  createPortofolio: async (req, res) => {
    try {
      const { keterangan } = req.body;

      if (!keterangan || keterangan.trim() === '') {
        return res.status(400).json({ success: false, message: 'Keterangan tidak boleh kosong' });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Gambar tidak boleh kosong' });
      }

      const protocol = req.protocol;
      const host = req.get('host');
      const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      const imagePublicId = req.file.filename;

      const newPortofolio = await Portofolio.create({
        keterangan: keterangan.trim(),
        gambar: imageUrl,
        gambarPublicId: imagePublicId,
      });

      return res.status(201).json({ success: true, message: 'Portofolio berhasil ditambahkan', data: newPortofolio });
    } catch (error) {
      console.error('Create Error:', error);
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(500).json({ success: false, message: error.message || 'Gagal menambahkan portofolio' });
    }
  },

  getPortofolioById: async (req, res) => {
    try {
      const portofolio = await Portofolio.findByPk(req.params.id);
      if (!portofolio) return res.status(404).json({ success: false, message: 'Portofolio tidak ditemukan' });
      return res.status(200).json({ success: true, message: 'Berhasil mengambil portofolio by id', data: portofolio });
    } catch (error) {
      console.error('error find by id', error.message);
      return res.status(500).json({ success: false, message: 'Gagal mengambil data portofolio by id', error: error.message });
    }
  },

  getAllPortofolio: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows } = await Portofolio.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset,
      });

      return res.status(200).json({
        success: true,
        message: 'Berhasil Mengambil Semua Data Portofolio',
        count: rows.length,
        data: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error('error get all', error.message);
      return res.status(500).json({ success: false, message: 'Gagal Mengambil Semua Data Portofolio', error: error.message });
    }
  },

  updatePortofolio: async (req, res) => {
    try {
      const { id } = req.params;
      const { keterangan } = req.body;

      if (!keterangan || keterangan.trim() === '') {
        return res.status(400).json({ success: false, message: 'Keterangan tidak boleh kosong' });
      }

      const portofolio = await Portofolio.findByPk(id);
      if (!portofolio) return res.status(404).json({ success: false, message: 'Portofolio tidak ditemukan' });

      const updateData = { keterangan: keterangan.trim() };

      if (req.file) {
        // Hapus file lama
        if (portofolio.gambarPublicId) {
          const oldFilePath = path.join('public/uploads', portofolio.gambarPublicId);
          fs.unlink(oldFilePath, (err) => { if (err) console.error('Gagal hapus file lama:', err.message); });
        }
        const protocol = req.protocol;
        const host = req.get('host');
        updateData.gambar = `${protocol}://${host}/uploads/${req.file.filename}`;
        updateData.gambarPublicId = req.file.filename;
      }

      await portofolio.update(updateData);
      return res.json({ success: true, message: 'Portofolio berhasil diupdate', data: portofolio });
    } catch (error) {
      console.error('Update Error:', error);
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(500).json({ success: false, message: error.message || 'Gagal update portofolio' });
    }
  },

  deletePortofolio: async (req, res) => {
    try {
      const portofolio = await Portofolio.findByPk(req.params.id);
      if (!portofolio) return res.status(404).json({ success: false, message: 'Portofolio tidak ditemukan' });

      if (portofolio.gambarPublicId) {
        const filePath = path.join('public/uploads', portofolio.gambarPublicId);
        fs.unlink(filePath, (err) => { if (err) console.error('Gagal hapus file:', err.message); });
      }

      await portofolio.destroy();
      return res.status(200).json({ success: true, message: 'Berhasil Menghapus Data Portofolio' });
    } catch (error) {
      console.error('Delete error:', error.message);
      return res.status(500).json({ success: false, message: 'Gagal Menghapus Data Portofolio', error: error.message });
    }
  },
};

export default portofolioController;
