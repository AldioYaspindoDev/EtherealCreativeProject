// controllers/articleController.js
import Article from '../models/articleModel.js';

const articleController = {
  createArticle: async (req, res) => {
    try {
      const { JudulArtikel, IsiArtikel, ImageUrl } = req.body;

      if (!JudulArtikel || !IsiArtikel) {
        return res.status(400).json({ success: false, message: 'Judul dan isi artikel wajib diisi.' });
      }

      const newArticle = await Article.create({
        judulArtikel: JudulArtikel,
        isiArtikel: IsiArtikel,
        imageUrl: ImageUrl || null,
      });

      res.status(201).json({ success: true, message: 'Artikel berhasil dibuat.', data: newArticle });
    } catch (error) {
      console.error('Error saat membuat artikel:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
  },

  getAllArticles: async (req, res) => {
    try {
      const articles = await Article.findAll({ order: [['createdAt', 'DESC']] });
      res.status(200).json({ success: true, count: articles.length, data: articles });
    } catch (error) {
      console.error('Error saat mengambil artikel:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
  },

  getArticleById: async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id);
      if (!article) return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
      res.status(200).json({ success: true, data: article });
    } catch (error) {
      console.error('Error saat mengambil artikel:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
  },

  updateArticle: async (req, res) => {
    try {
      const { JudulArtikel, IsiArtikel, ImageUrl } = req.body;
      const article = await Article.findByPk(req.params.id);
      if (!article) return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });

      await article.update({
        judulArtikel: JudulArtikel ?? article.judulArtikel,
        isiArtikel:   IsiArtikel   ?? article.isiArtikel,
        imageUrl:     ImageUrl     ?? article.imageUrl,
      });

      res.status(200).json({ success: true, message: 'Artikel berhasil diperbarui.', data: article });
    } catch (error) {
      console.error('Error saat memperbarui artikel:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
  },

  deleteArticle: async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id);
      if (!article) return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });

      await article.destroy();
      res.status(200).json({ success: true, message: 'Artikel berhasil dihapus.' });
    } catch (error) {
      console.error('Error saat menghapus artikel:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
  },
};

export default articleController;
