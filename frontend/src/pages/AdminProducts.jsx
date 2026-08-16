import { useState, useEffect } from 'react';

// Fungsi helper untuk mendeteksi key localStorage yang dipakai oleh Halaman Riwayat Pesanan
const getStoredOrders = () => {
  const possibleKeys = ['orders', 'orderHistory', 'userOrders', 'appOrders', 'history'];
  for (const key of possibleKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return { key, data: parsed };
      } catch (e) { /* abaikan error JSON parse */ }
    }
  }
  return { key: 'orders', data: [] };
};

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Sepatu Sneaker Red Urban', category: '👟 Sepatu', price: 450000, stock: 12, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
  { id: 2, name: 'Sepatu Running Pro Sport', category: '👟 Sepatu', price: 620000, stock: 8, image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500' }
];

const CATEGORIES = ['👟 Sepatu', '💻 Laptop', '🎒 Tas', '⌚ Jam', '🎧 Audio', '📱 Gadget'];
const EMPTY_FORM = { name: '', category: '👟 Sepatu', price: '', stock: '', image: '', description: '' };

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('appProducts')) || INITIAL_PRODUCTS);
  
  const [activeOrderKey, setActiveOrderKey] = useState('orders');
  const [orders, setOrders] = useState(() => getStoredOrders().data);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Auto-sync membaca localStorage saat halaman Admin dibuka/difokuskan
  useEffect(() => {
    const syncOrders = () => {
      const res = getStoredOrders();
      setOrders(res.data);
      setActiveOrderKey(res.key);
    };
    syncOrders();

    window.addEventListener('storage', syncOrders);
    window.addEventListener('focus', syncOrders);
    return () => {
      window.removeEventListener('storage', syncOrders);
      window.removeEventListener('focus', syncOrders);
    };
  }, []);

  // Simpan otomatis state produk
  useEffect(() => { localStorage.setItem('appProducts', JSON.stringify(products)); }, [products]);
  
  // Simpan perubahan status pesanan ke key yang benar
  const handleStatusChange = (orderId, newStatus) => {
    const updated = orders.map(o => (o.id === orderId || o.invoice === orderId) ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem(activeOrderKey, JSON.stringify(updated));
    showToast(`Status pesanan berhasil diubah menjadi "${newStatus}"`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setFormData(product ? { ...product, description: product.description || '' } : EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      image: formData.image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500'
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p));
      showToast(`Produk "${formData.name}" berhasil diperbarui!`);
    } else {
      setProducts([{ id: Date.now(), rating: 5.0, ...payload }, ...products]);
      showToast(`Produk "${formData.name}" berhasil ditambahkan!`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      setProducts(products.filter(p => p.id !== id));
      showToast(`Produk "${name}" telah dihapus.`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", padding: '16px 12px 80px' }}>
      <style>{`
        .admin-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .btn-add { background: #2563eb; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.25); white-space: nowrap; }
        .tab-switcher { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab-btn { flex: 1; text-align: center; padding: 10px 14px; border-radius: 10px; border: 1px solid #e2e8f0; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: #2563eb; color: #fff; border-color: #2563eb; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
        .tab-btn.inactive { background: #fff; color: #64748b; }
        .admin-table-container { background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; overflow-x: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .admin-table { width: 100%; min-width: 600px; border-collapse: collapse; text-align: left; font-size: 13px; }
        .admin-table th { background: #f1f5f9; color: #475569; padding: 12px 16px; font-weight: 700; }
        .admin-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; }
        .form-input { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; box-sizing: border-box; margin-top: 4px; outline: none; }
        .btn-act { border: none; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
        @media (max-width: 640px) { .admin-header { flex-direction: column; align-items: stretch; } .btn-add, .tab-switcher { width: 100%; } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#0f172a', color: '#fff', padding: '12px 20px', borderRadius: '12px', zIndex: 2000, fontSize: '14px', fontWeight: '600' }}>
          ✓ {toastMessage}
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="admin-header">
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 4px' }}>Panel Dashboard Admin</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Kelola stok barang dan perbarui status pesanan pembeli</p>
          </div>
          {activeTab === 'products' && (
            <button onClick={() => handleOpenModal()} className="btn-add">+ Tambah Produk Baru</button>
          )}
        </div>

        <div className="tab-switcher">
          <button onClick={() => setActiveTab('products')} className={`tab-btn ${activeTab === 'products' ? 'active' : 'inactive'}`}>
            🏷️ Produk ({products.length})
          </button>
          <button onClick={() => setActiveTab('orders')} className={`tab-btn ${activeTab === 'orders' ? 'active' : 'inactive'}`}>
            📦 Pesanan ({orders.length})
          </button>
        </div>

        {/* TAB PRODUK */}
        {activeTab === 'products' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Belum ada produk tersimpan.</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                          <span style={{ fontWeight: '700' }}>{p.name}</span>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td style={{ fontWeight: '700', color: '#2563eb' }}>Rp {Number(p.price).toLocaleString('id-ID')}</td>
                      <td>{p.stock} unit</td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => handleOpenModal(p)} className="btn-act" style={{ backgroundColor: '#f1f5f9', color: '#334155', marginRight: '6px' }}>✏️ Edit</button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="btn-act" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>🗑️ Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB PESANAN */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.length === 0 ? (
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#64748b' }}>
                📦 Belum ada pesanan masuk dari pembeli.
              </div>
            ) : (
              orders.map((order, idx) => {
                const orderId = order.id || order.invoice || idx;
                const items = order.items || order.products || [];
                const itemName = items.length > 0 ? items[0].name : (order.productName || 'Produk Pesanan');
                const itemQty = items.length > 0 ? items[0].quantity || items[0].qty || 1 : 1;
                
                return (
                  <div key={orderId} style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <span style={{ fontWeight: '800', color: '#2563eb', fontSize: '14px' }}>{order.invoice || `INV-${orderId}`}</span>
                        <span style={{ color: '#64748b', fontSize: '12px', marginLeft: '10px' }}>📅 {order.date || 'Baru Saja'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Status:</label>
                        <select
                          value={order.status || 'Diproses'}
                          onChange={(e) => handleStatusChange(orderId, e.target.value)}
                          style={{
                            padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '700', fontSize: '12px', outline: 'none', cursor: 'pointer',
                            backgroundColor: order.status === 'Selesai' ? '#dcfce7' : order.status === 'Dikirim' ? '#e0f2fe' : '#fef9c3',
                            color: order.status === 'Selesai' ? '#15803d' : order.status === 'Dikirim' ? '#0369a1' : '#a16207'
                          }}
                        >
                          <option value="Diproses">⏳ Diproses</option>
                          <option value="Dikirim">🚚 Dikirim</option>
                          <option value="Selesai">✅ Selesai</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                      <div><strong>Item:</strong> {itemName} ({itemQty}x)</div>
                      <div><strong>Pembeli:</strong> {order.name || order.user || 'Pelanggan'} ({order.phone || '-'})</div>
                      <div><strong>Alamat:</strong> {order.address || '-'}</div>
                      <div><strong>Metode:</strong> {order.paymentMethod || order.payment || 'Transfer Bank'}</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Total Tagihan:</span>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: '#2563eb' }}>
                        Rp {(order.total || order.totalPrice || order.price || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* MODAL EDIT / TAMBAH PRODUK */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', maxWidth: '480px', width: '100%', padding: '20px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'fadeIn 0.25s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>{editingProduct ? 'Edit Data Produk' : 'Tambah Produk Baru'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', fontWeight: '700', color: '#94a3b8', cursor: 'pointer', padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Nama Produk</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="Masukkan nama barang" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Kategori</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="form-input">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Stok</label>
                  <input type="number" required min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="form-input" placeholder="Contoh: 10" />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Harga (Rp)</label>
                <input type="number" required min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="form-input" placeholder="Contoh: 150000" />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Pilih Gambar dari Komputer / Berkas</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" style={{ padding: '6px', cursor: 'pointer' }} />
                {formData.image && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>✓ Gambar terpilih</span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Deskripsi Ringkas</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="form-input" placeholder="Keterangan spesifikasi barang..." />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                  {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}