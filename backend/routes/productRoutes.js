const express = require('express');
const router = express.Router();
const db = require('../config/db');
// Pastikan baris di bawah ini meng-import { verifyAdmin }
const { verifyAdmin } = require('../middleware/authMiddleware');

// 1. LIHAT SEMUA PRODUK (Publik)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. TAMBAH PRODUK (Khusus Admin)
router.post('/', verifyAdmin, async (req, res) => {
  const { name, price, description, stock, image_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (name, price, description, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, description, stock || 0, image_url]
    );
    res.status(201).json({ message: 'Produk berhasil ditambahkan!', product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. HAPUS PRODUK (Khusus Admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Produk berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;