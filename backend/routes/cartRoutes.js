const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');

// 1. LIHAT ISI KERANJANG (GET /api/cart)
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT c.id AS cart_id, c.quantity, p.id AS product_id, p.name, p.price, p.image_url 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1 
       ORDER BY c.id DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. TAMBAH KE KERANJANG (POST /api/cart)
router.post('/', verifyToken, async (req, res) => {
  const { product_id, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Cek jika item sudah ada di keranjang, maka tambahkan jumlahnya saja
    const existingCart = await db.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    );

    if (existingCart.rows.length > 0) {
      const updatedCart = await db.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
        [quantity || 1, existingCart.rows[0].id]
      );
      return res.json({ message: 'Jumlah barang di keranjang diperbarui!', cart: updatedCart.rows[0] });
    }

    // Jika belum ada, buat record baru
    const newCart = await db.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [userId, product_id, quantity || 1]
    );
    res.status(201).json({ message: 'Berhasil dimasukkan ke keranjang!', cart: newCart.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. HAPUS ITEM KERANJANG (DELETE /api/cart/:id)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await db.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [id, userId]);
    res.json({ message: 'Item berhasil dihapus dari keranjang!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;