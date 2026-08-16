import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const BANNERS = [
  { id: 1, tag: 'PROMO SPESIAL ⚡', title: 'Diskon Hingga 50%', subtitle: 'Khusus transaksi hari ini di E-Store!', bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', icon: '🎁' },
  { id: 2, tag: 'FLASH SALE 🔥', title: 'Gratis Ongkir Rp0', subtitle: 'Minimum belanja 50rb ke seluruh Indonesia', bg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', icon: '🚚' },
  { id: 3, tag: 'NEW ARRIVAL ✨', title: 'Koleksi Gadget Terbaru', subtitle: 'Dapatkan cashback hingga Rp 100.000', bg: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', icon: '📱' }
];

const CATEGORIES = ['Semua', '👟 Sepatu', '💻 Laptop', '🎒 Tas', '⌚ Jam', '🎧 Audio', '📱 Gadget'];

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Sepatu Sneaker Red Urban', category: '👟 Sepatu', price: 450000, rating: 4.8, description: 'Sepatu sneaker kasual dengan sol karet fleksibel dan bahan canvas breathable.', stock: 12, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Sepatu Running Pro Sport', category: '👟 Sepatu', price: 620000, rating: 4.9, description: 'Sepatu lari spesifikasi profesional dengan bantalan busa ekstra empuk.', stock: 8, image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Sepatu Loafer Kulit Classy', category: '👟 Sepatu', price: 850000, rating: 4.7, description: 'Sepatu loafer bahan kulit sintetis premium dengan desain slip-on.', stock: 5, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Laptop Gaming Turbo RTX', category: '💻 Laptop', price: 14500000, rating: 4.9, description: 'Intel Core i7 Gen 13, RAM 16GB DDR5, SSD 1TB, GPU RTX 4060.', stock: 4, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60' },
  { id: 5, name: 'Ultrabook Slim Touchscreen', category: '💻 Laptop', price: 9800000, rating: 4.8, description: 'Laptop super tipis 1.1kg, layar sentuh IPS 2K, baterai hingga 12 jam.', stock: 7, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60' },
  { id: 6, name: 'Laptop Office & Student', category: '💻 Laptop', price: 5200000, rating: 4.6, description: 'Laptop handal untuk dokumen & browsing. Intel i3 & SSD 512GB.', stock: 15, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60' },
  { id: 7, name: 'Tas Ransel Modern Waterproof', category: '🎒 Tas', price: 280000, rating: 4.7, description: 'Ransel 25L bahan polyester anti air dengan kompartemen laptop 15.6".', stock: 20, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60' },
  { id: 8, name: 'Tas Selempang Canvas Casual', category: '🎒 Tas', price: 175000, rating: 4.5, description: 'Tas selempang gaya minimalis untuk HP, dompet, dan tablet ringkas.', stock: 14, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60' },
  { id: 9, name: 'Tas Duffel Travel Weekender', category: '🎒 Tas', price: 420000, rating: 4.8, description: 'Tas pakaian kapasitas besar dengan kompartemen khusus sepatu.', stock: 9, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60' },
  { id: 10, name: 'Jam Tangan Stainless Elegant', category: '⌚ Jam', price: 1250000, rating: 5.0, description: 'Jam analog stainless steel anti karat, water resistant 50m.', stock: 6, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60' },
  { id: 11, name: 'Smartwatch Active Fit', category: '⌚ Jam', price: 790000, rating: 4.7, description: 'Smartwatch AMOLED, pantau detak jantung, SpO2, & 100+ mode olahraga.', stock: 18, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=60' },
  { id: 12, name: 'Headphone Wireless Bass Boost', category: '🎧 Audio', price: 550000, rating: 4.8, description: 'Headphone Bluetooth Deep Bass, mic jernih, baterai 40 jam.', stock: 11, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60' },
  { id: 13, name: 'TWS Earphone ANC Pro', category: '🎧 Audio', price: 320000, rating: 4.6, description: 'Wireless earphone dengan Active Noise Cancellation & low-latency gaming.', stock: 25, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60' },
  { id: 14, name: 'Smartphone Flagship X', category: '📱 Gadget', price: 8900000, rating: 4.9, description: 'Kamera 108MP, AMOLED 120Hz 6.7", chipset kencang, fast charge 67W.', stock: 10, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60' },
  { id: 15, name: 'Tablet Drawing & Note 10.5"', category: '📱 Gadget', price: 4600000, rating: 4.8, description: 'Tablet layar lebar termasuk Stylus Pen peka tekanan.', stock: 7, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60' }
];

// Helper menggabungkan produk dari Admin + Produk Bawaan
const getStoredProducts = () => {
  let stored = [];
  const possibleKeys = ['appProducts', 'products', 'adminProducts'];
  
  for (const key of possibleKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          stored = parsed;
          break;
        }
      } catch (e) { /* abaikan error */ }
    }
  }

  // Jika ada data produk di localStorage dari Admin
  if (stored.length > 0) {
    // Cari produk bawaan yang belum ada di localStorage (mencegah duplikat)
    const storedIdsOrNames = new Set(stored.map(p => p.id || p.name));
    const uniqueDefaults = DEFAULT_PRODUCTS.filter(p => !storedIdsOrNames.has(p.id) && !storedIdsOrNames.has(p.name));
    
    // Gabungkan produk baru dari Admin dengan produk lama bawaan
    return [...stored, ...uniqueDefaults];
  }

  return DEFAULT_PRODUCTS;
};

export default function Home({ searchTerm = '', setSearchTerm }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(() => getStoredProducts());
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [bannerIdx, setBannerIdx] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQty, setModalQty] = useState(1);

  // Auto-slide banner
  useEffect(() => {
    const timer = setInterval(() => setBannerIdx((prev) => (prev + 1) % BANNERS.length), 3500);
    return () => clearInterval(timer);
  }, []);

  // Sync produk saat halaman terbuka/fokus kembali
  useEffect(() => {
    const syncProducts = () => setProducts(getStoredProducts());
    syncProducts();

    window.addEventListener('storage', syncProducts);
    window.addEventListener('focus', syncProducts);
    return () => {
      window.removeEventListener('storage', syncProducts);
      window.removeEventListener('focus', syncProducts);
    };
  }, []);

  const handleAddToCart = (product, e) => {
    e?.stopPropagation();
    addToCart(product);
    toast.success(`"${product.name}" masuk keranjang!`, { icon: '🛒' });
  };

  const handleAddFromModal = () => {
    for (let i = 0; i < modalQty; i++) addToCart(selectedProduct);
    toast.success(`${modalQty}x "${selectedProduct.name}" masuk keranjang!`, { icon: '🛒' });
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(p => {
    const nameMatch = (p.name || '').toLowerCase().includes((searchTerm || '').toLowerCase());
    const catMatch = selectedCategory === 'Semua' || (p.category && p.category.includes(selectedCategory));
    return nameMatch && catMatch;
  });

  const activeBanner = BANNERS[bannerIdx];

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        html, body, #root { margin: 0 !important; padding: 0 !important; background-color: #f8fafc !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .category-chip { transition: all 0.2s ease; white-space: nowrap; cursor: pointer; padding: 8px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .category-chip.active { background-color: #2563eb; color: #fff; border-color: #2563eb; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); }
        .product-card-mobile { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; transition: all 0.25s ease; display: flex; flex-direction: column; cursor: pointer; }
        .product-card-mobile:hover { transform: translateY(-4px); border-color: #cbd5e1; box-shadow: 0 12px 20px -8px rgba(0,0,0,0.08); }
        .btn-add-quick { background-color: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 6px 12px; font-weight: 700; font-size: 12px; cursor: pointer; transition: all 0.2s ease; }
        .btn-add-quick:hover { background-color: #1d4ed8; }
        .btn-add-quick:active { transform: scale(0.94); }
        .banner-nav-btn { background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.3); color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; transition: all 0.2s; }
        .banner-nav-btn:hover { background: rgba(255,255,255,0.4); }
        .banner-dot { width: 8px; height: 8px; border-radius: 50%; background-color: rgba(255,255,255,0.4); transition: all 0.3s ease; cursor: pointer; }
        .banner-dot.active { width: 20px; border-radius: 10px; background-color: #fff; }
        .products-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .qty-btn { border: none; background: #fff; width: 28px; height: 28px; border-radius: 6px; font-weight: bold; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        @media (min-width: 640px) { .products-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
        @media (min-width: 1024px) { .products-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }
        @media (max-width: 768px) { .home-search-bar { display: none !important; } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* Modal Detail Produk */}
      {selectedProduct && (
        <div onClick={() => setSelectedProduct(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '20px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px', position: 'relative', animation: 'fadeIn 0.25s ease-out' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: '#64748b' }}>✕</button>
            <div style={{ position: 'relative', paddingTop: '75%', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
              <img src={selectedProduct.image || 'https://via.placeholder.com/300'} alt={selectedProduct.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '12px' }}>{selectedProduct.category}</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#d97706' }}>★ {selectedProduct.rating || '5.0'} / 5.0</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px' }}>{selectedProduct.name}</h2>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb', marginBottom: '14px' }}>Rp {Number(selectedProduct.price).toLocaleString('id-ID')}</div>
            <div style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '12px 0', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 4px', fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Deskripsi Produk</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>{selectedProduct.description || 'Tidak ada deskripsi.'}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Stok Tersedia</span>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{selectedProduct.stock} unit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', padding: '4px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <button className="qty-btn" onClick={() => setModalQty(Math.max(1, modalQty - 1))}>-</button>
                <span style={{ width: '24px', textAlign: 'center', fontWeight: '700', fontSize: '14px' }}>{modalQty}</span>
                <button className="qty-btn" onClick={() => setModalQty(Math.min(selectedProduct.stock, modalQty + 1))}>+</button>
              </div>
            </div>
            <button onClick={handleAddFromModal} style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
              + Tambahkan Keranjang • Rp {(Number(selectedProduct.price) * modalQty).toLocaleString('id-ID')}
            </button>
          </div>
        </div>
      )}

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 16px 60px' }}>

        {/* Input Search Bar */}
        <div className="home-search-bar" style={{ marginBottom: '16px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '16px' }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 40px 12px 45px', borderRadius: '50px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', fontSize: '14px', outline: 'none', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)', boxSizing: 'border-box' }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm && setSearchTerm('')} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}>
              ✕
            </button>
          )}
        </div>

        {/* Banner Promo */}
        <div style={{ background: activeBanner.bg, borderRadius: '16px', padding: '18px 44px', marginBottom: '16px', position: 'relative', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
          <button onClick={() => setBannerIdx(p => (p === 0 ? BANNERS.length - 1 : p - 1))} className="banner-nav-btn" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>❮</button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(255,255,255,0.25)', color: '#fff', padding: '4px 10px', borderRadius: '20px' }}>{activeBanner.tag}</span>
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '8px 0 2px', color: '#fff' }}>{activeBanner.title}</h2>
              <p style={{ fontSize: '12px', color: '#f1f5f9', margin: 0 }}>{activeBanner.subtitle}</p>
            </div>
            <div style={{ fontSize: '38px' }}>{activeBanner.icon}</div>
          </div>
          <button onClick={() => setBannerIdx(p => (p + 1) % BANNERS.length)} className="banner-nav-btn" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>❯</button>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '14px' }}>
            {BANNERS.map((_, i) => (
              <div key={i} onClick={() => setBannerIdx(i)} className={`banner-dot ${bannerIdx === i ? 'active' : ''}`} />
            ))}
          </div>
        </div>

        {/* Filter Kategori */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              style={{ border: selectedCategory === cat ? '1px solid #2563eb' : '1px solid #e2e8f0', backgroundColor: selectedCategory === cat ? '#2563eb' : '#fff', color: selectedCategory === cat ? '#fff' : '#475569' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '42px', display: 'block', marginBottom: '10px' }}>🔍</span>
            <h3 style={{ margin: '0 0 6px', fontSize: '16px' }}>Produk Tidak Ditemukan</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Coba cari dengan kata kunci lain atau pilih kategori berbeda.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card-mobile" onClick={() => { setSelectedProduct(product); setModalQty(1); }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '100%', backgroundColor: '#f1f5f9' }}>
                  <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', color: '#d97706' }}>
                    ★ {product.rating || '5.0'}
                  </div>
                </div>
                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>
                      {product.name}
                    </h3>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#2563eb', marginBottom: '8px' }}>
                      Rp {Number(product.price).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Stok: {product.stock}</span>
                    <button onClick={(e) => handleAddToCart(product, e)} className="btn-add-quick">+ Beli</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}