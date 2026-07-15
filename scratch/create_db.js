import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function createDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'etherealkreatif'}\`;`);
    console.log(`Database ${process.env.DB_NAME || 'etherealkreatif'} created or already exists.`);
  } catch (err) {
    console.error('Error creating database:', err.message);
  } finally {
    await connection.end();
  }
}

createDB();
