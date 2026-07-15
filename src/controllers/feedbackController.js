// controllers/feedbackController.js
import Feedback from '../models/feedbackModel.js';

const feedbackController = {
  createFeedback: async (req, res) => {
    try {
      const { komentar, rating } = req.body;
      const feedback = await Feedback.create({ komentar, rating });
      res.status(201).json({ success: true, message: 'Berhasil memberikan feedback', data: feedback });
    } catch (error) {
      console.error('error create', error.message);
      res.status(500).json({ success: false, message: 'Gagal memberikan feedback', error: error.message });
    }
  },

  getAllFeedback: async (req, res) => {
    try {
      const feedbacks = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
      res.status(200).json({ success: true, message: 'Berhasil mengambil data feedback', data: feedbacks });
    } catch (error) {
      console.error('error get all', error.message);
      res.status(500).json({ success: false, message: 'Gagal mengambil data feedback', error: error.message });
    }
  },

  getFeedbackById: async (req, res) => {
    try {
      const { id } = req.params;
      const feedback = await Feedback.findByPk(id);
      if (!feedback) return res.status(404).json({ success: false, message: 'Feedback tidak ditemukan' });
      res.status(200).json({ success: true, message: 'Berhasil mengambil data feedback berdasarkan ID', data: feedback });
    } catch (error) {
      console.error('error get by id', error.message);
      res.status(500).json({ success: false, message: 'Gagal mengambil data berdasarkan ID', error: error.message });
    }
  },

  updateFeedback: async (req, res) => {
    try {
      const { id } = req.params;
      const { komentar, rating } = req.body;

      const feedback = await Feedback.findByPk(id);
      if (!feedback) return res.status(404).json({ success: false, message: 'Feedback tidak ditemukan' });

      await feedback.update({ komentar, rating });
      res.status(200).json({ success: true, message: 'Berhasil update feedback', data: feedback });
    } catch (error) {
      console.error('error update', error.message);
      res.status(500).json({ success: false, message: 'Gagal mengupdate feedback', error: error.message });
    }
  },

  deleteFeedback: async (req, res) => {
    try {
      const { id } = req.params;
      const feedback = await Feedback.findByPk(id);
      if (!feedback) return res.status(404).json({ success: false, message: 'Feedback tidak ditemukan' });

      await feedback.destroy();
      res.status(200).json({ success: true, message: 'Berhasil menghapus feedback' });
    } catch (error) {
      console.error('error delete', error.message);
      res.status(500).json({ success: false, message: 'Gagal menghapus data', error: error.message });
    }
  },
};

export default feedbackController;
