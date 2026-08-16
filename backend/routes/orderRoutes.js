const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');

// 1. CHECKOUT / BUAT PESANAN (Memotong Stok Otomatis)
router.post('/', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Ambil semua item di keranjang user
    const cartItems = await db.query(
      `SELECT cart.id as cart_id, cart.quantity, products.id as product_id, products.name, products.price, products.stock 
       FROM cart 
       JOIN products ON cart.product_id = products.id 
       WHERE cart.user_id = $1`,
      [userId]
    );

    if (cartItems.rows.length === 0) {
      return res.status(400).json({ message: 'Keranjang belanja kamu masih kosong!' });
    }

    // Cek ketersediaan stok terlebih dahulu
    for (const item of cartItems.rows) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Stok produk "${item.name}" tidak mencukupi (Tersisa: ${item.stock})` 
        });
      }
    }

    // Hitung total harga
    const totalPrice = cartItems.rows.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    // Simpan pesanan ke tabel orders
    const orderResult = await db.query(
      'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, totalPrice, 'PENDING']
    );

    // Potong stok produk & hapus dari keranjang
    for (const item of cartItems.rows) {
      await db.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Kosongkan keranjang belanja
    await db.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    res.status(201).json({
      message: 'Checkout berhasil! Pesanan telah dibuat.',
      order: orderResult.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LIHAT RIWAYAT PESANAN USER
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;