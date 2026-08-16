const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./config/db'); // Pastikan path ini sesuai dengan file koneksi DB kamu
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const googleClient = new OAuth2Client('142187596314-8jco1u7jt8526sm9kqcr6q667rq5hugs.apps.googleusercontent.com');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Endpoint
app.get('/', (req, res) => {
  res.send('API E-Commerce Berjalan!');
});

// --- ENDPOINT LOGIN GOOGLE ---
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  try {
    // 1. Verifikasi token ke Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: '142187596314-8jco1u7jt8526sm9kqcr6q667rq5hugs.apps.googleusercontent.com',
    });
    const { email, name } = ticket.getPayload();

    // 2. Cek apakah user sudah ada di database Neon DB
    let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user;

    if (userResult.rows.length === 0) {
      // Jika belum ada, simpan sebagai user baru
      const newUser = await pool.query(
        'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id, name, email, role',
        [name, email, 'user']
      );
      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
    }

    // 3. Buat JWT Token untuk sesi aplikasi
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login Google Berhasil', token, user });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ message: 'Login Google Gagal' });
  }
});

// Pendaftaran Router API Lainnya
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes); 
app.use('/api/orders', orderRoutes);

// Menjalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});