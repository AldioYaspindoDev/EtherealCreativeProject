import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function fix() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    console.log('Attempting to drop ghost database...');
    await connection.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME || 'etherealkreatif'}\`;`);
    console.log('Drop successful.');
    
    console.log('Attempting to create database again...');
    await connection.query(`CREATE DATABASE \`${process.env.DB_NAME || 'etherealkreatif'}\`;`);
    console.log('Create successful.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await connection.end();
  }
}

fix();
