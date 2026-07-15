// controllers/userAdminController.js
import UserAdmin from '../models/userAdminModel.js';
import UserCustomer from '../models/userCustomerModel.js';
import jwt from 'jsonwebtoken';

const userAdminController = {
  // Ambil semua user admin
  getAllUsers: async (req, res) => {
    try {
      const users = await UserAdmin.findAll();
      res.status(200).json({ success: true, message: 'Berhasil mengambil semua data user', data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal mengambil data user', error: error.message });
    }
  },

  // Register admin
  register: async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    try {
      const existingUser = await UserAdmin.scope('withPassword').findOne({
        where: { username: username.toLowerCase().trim() },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Username sudah terdaftar' });
      }

      // Buat instance langsung (trigger beforeSave hook untuk bcrypt)
      const newUser = await UserAdmin.scope('withPassword').create({
        username: username.toLowerCase().trim(),
        password: password.trim(),
        role: role || 'admin',
      });

      res.status(201).json({
        success: true,
        message: 'User berhasil didaftarkan',
        data: { id: newUser.id, username: newUser.username, role: newUser.role },
      });
    } catch (error) {
      console.error('SERVER 500 ERROR IN REGISTER:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Server error saat registrasi', error: error.message });
    }
  },

  // Login admin
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
      }

      const user = await UserAdmin.scope('withPassword').findOne({
        where: { username: username.toLowerCase().trim() },
      });

      if (!user) {
        console.log('❌ Admin not found:', username);
        return res.status(400).json({ message: 'User tidak ditemukan.' });
      }

      const valid = await user.comparePassword(password);
      if (!valid) {
        console.log('❌ Password incorrect');
        return res.status(400).json({ message: 'Password salah.' });
      }

      const token = jwt.sign(
        { id: user.id, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' },
      );

      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Admin login success',
        token,
        user: { id: user.id, username: user.username, role: user.role },
      });

      console.log('✅ Admin login successful for:', username);
    } catch (error) {
      console.error('❌ Admin login error:', error);
      res.status(500).json({ success: false, message: 'Server error saat login', error: error.message });
    }
  },

  // Delete admin user
  userDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const currentAdminId = req.user.id.toString();

      if (id === currentAdminId) {
        return res.status(400).json({
          success: false,
          message: 'Akses Ditolak: Anda tidak dapat menghapus akun Admin Anda sendiri.',
        });
      }

      const user = await UserAdmin.findByPk(id);
      if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

      await user.destroy();
      res.status(200).json({ success: true, message: 'User berhasil dihapus' });
    } catch (error) {
      console.error('Error delete user:', error.message);
      res.status(500).json({ success: false, message: 'Gagal menghapus user', error: error.message });
    }
  },

  // Delete customer (by admin)
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await UserCustomer.findByPk(id);
      if (!customer) return res.status(404).json({ success: false, message: 'User customer tidak ditemukan' });

      await customer.destroy();
      res.status(200).json({ success: true, message: 'Berhasil menghapus user customer' });
    } catch (error) {
      console.error('Error delete customer:', error.message);
      res.status(500).json({ success: false, message: 'Gagal menghapus user customer', error: error.message });
    }
  },

  // Get all customers
  getAllCustomer: async (req, res) => {
    try {
      const customers = await UserCustomer.findAll();
      res.status(200).json({
        success: true,
        message: 'Berhasil Mengambil semua data user Customer',
        data: customers,
      });
    } catch (error) {
      console.error('error Get all', error.message);
      res.status(500).json({ success: false, message: 'Gagal Mengambil semua data user Customer', error: error.message });
    }
  },
};

export default userAdminController;