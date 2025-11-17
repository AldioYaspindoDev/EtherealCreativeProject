# EtherealCreativeProject
Ethereal Creative adalah proyek pengembangan website untuk perusahaan Ethereal, sebuah brand fashion yang bergerak di bidang penjualan pakaian dan jeans di Kota Padang. Website ini dirancang untuk mendukung operasional bisnis, termasuk pengelolaan produk, pelanggan, serta tampilan katalog yang modern dan responsif.

🌟 Ethereal Creative – E-Commerce Fashion Website

Ethereal Creative adalah proyek website e-commerce yang dirancang untuk perusahaan Ethereal, sebuah brand fashion yang bergerak di bidang penjualan pakaian dan jeans di Kota Padang.
Website ini dibuat untuk mempermudah pelanggan dalam melihat katalog produk, melakukan pemesanan, dan mengelola transaksi secara modern dan efisien.

🚀 Tech Stack
Frontend

Next.js

React.js

TailwindCSS

Axios

Backend

Node.js

Express.js

JWT Authentication

Cloudinary (opsional, jika untuk upload gambar)

Database

MongoDB & Mongoose

✅ Fitur Utama

Product Catalog: Menampilkan daftar produk lengkap dengan foto, harga, dan deskripsi.

Shopping Cart: Menyimpan barang yang dipilih sebelum checkout.

User Authentication: Login, register, dan proteksi halaman menggunakan JWT.

Admin Dashboard:

Kelola produk (CRUD)

Kelola transaksi

Kelola users

Responsive Design: Nyaman diakses dari HP, tablet, dan desktop.

REST API Backend yang terstruktur.

📁 Project Structure
EtherealCreativeProject/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│   └── server.js
│
├── frontend/
│   ├── app/ (Next.js pages/routes)
│   ├── components/
│   ├── public/
│   └── package.json
│
└── README.md

🔧 Instalasi & Setup
1️⃣ Clone Repository
git clone https://github.com/username/EtherealCreativeProject.git
cd EtherealCreativeProject

2️⃣ Setup Backend
cd backend
npm install

Buat file .env
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret_key
CLOUDINARY_API_KEY=optional_if_used
CLOUDINARY_API_SECRET=optional_if_used
CLOUDINARY_CLOUD_NAME=optional

Jalankan Backend
npm run dev

3️⃣ Setup Frontend
cd frontend
npm install

Jalankan Frontend
npm run dev


Frontend akan berjalan di:

http://localhost:3000


Backend akan berjalan di:

http://localhost:5000

🧪 API Endpoint (Backend)

Beberapa endpoint utama:

Auth

POST /auth/register

POST /auth/login

Products

GET /products

POST /products (admin)

PUT /products/:id (admin)

DELETE /products/:id (admin)

Cart & Transaction

POST /cart

POST /checkout

📸 Preview (Opsional)

Tambahkan screenshot halaman jika sudah ada.

👨‍💻 Developer

Aldio Yaspindo
Software Engineer — Indonesia
GitHub: AldioYaspindoDev

⭐ Support Project Ini

Jika kamu suka proyek ini, jangan lupa:

⭐ Star repo ini

🐛 Buat issue jika menemukan bug

🤝 Berkontribusi melalui pull request
