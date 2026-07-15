import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import { syncDB } from './src/models/index.js';
import UserAdmin from './src/models/userAdminModel.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    await syncDB({ alter: true });

    const username = 'admin12345';
    const password = 'admin12345';

    console.log('Checking for existing admin user...');
    const existingAdmin = await UserAdmin.findOne({ where: { username } });

    if (existingAdmin) {
      console.log('Admin user already exists.');
      console.log('Username: ' + username);
      process.exit(0);
    }

    console.log('Creating new admin user...');
    // Gunakan scope withPassword agar beforeSave hook berjalan (hash password)
    const admin = await UserAdmin.scope('withPassword').create({
      username,
      password,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('Username: ' + username);
    console.log('Password: ' + password);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
