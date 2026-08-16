import { useState, useEffect } from 'react';

// Helper pencarian key localStorage agar seragam dengan Admin
const getStoredOrders = () => {
  const possibleKeys = ['orders', 'orderHistory', 'userOrders', 'appOrders', 'history'];
  for (const key of possibleKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* abaikan error parse */ }
    }
  }
  return [];
};

export default function RiwayatPesanan() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [orders, setOrders] = useState(() => getStoredOrders());

  // Auto-sync jika Admin mengubah status pesanan di tab/window lain
  useEffect(() => {
    const syncOrders = () => setOrders(getStoredOrders());
    window.addEventListener('storage', syncOrders);
    window.addEventListener('focus', syncOrders);
    return () => {
      window.removeEventListener('storage', syncOrders);
      window.removeEventListener('focus', syncOrders);
    };
  }, []);

  // Filter pesanan berdasarkan tab aktif
  const filteredOrders = activeTab === 'Semua' 
    ? orders 
    : orders.filter(order => (order.status || 'Diproses') === activeTab);

  // Helper tampilan warna badge status
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Selesai': return { bg: '#dcfce7', color: '#15803d' };
      case 'Dikirim': return { bg: '#e0f2fe', color: '#0369a1' };
      default: return { bg: '#fef9c3', color: '#a16207' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", padding: '32px 16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px' }}>Riwayat Pesanan</h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>Pantau status transaksi dan pengiriman barang belanjaan Anda</p>

        {/* Tab Filter Button */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['Semua', 'Diproses', 'Dikirim', 'Selesai'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#2563eb' : '#fff',
                  color: isActive ? '#fff' : '#64748b',
                  boxShadow: isActive ? '0 4px 12px rgba(37,99,235,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* List Pesanan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
              Belum ada pesanan dengan status "{activeTab}".
            </div>
          ) : (
            filteredOrders.map((order, index) => {
              const orderId = order.invoice || `INV-${order.id || index}`;
              const currentStatus = order.status || 'Diproses';
              const badge = getBadgeStyle(currentStatus);
              const items = order.items || order.products || [];
              const itemName = items.length > 0 ? items[0].name : (order.productName || 'Sepatu Running Pro Sport');
              const itemImage = items.length > 0 ? items[0].image : (order.image || 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500');
              const itemQty = items.length > 0 ? (items[0].quantity || items[0].qty || 1) : 1;
              const itemPrice = items.length > 0 ? items[0].price : (order.price || order.total || 0);

              return (
                <div key={orderId} style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <div>
                      <span style={{ fontWeight: '800', fontSize: '14px', marginRight: '10px' }}>{orderId}</span>
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>{order.date || '16 Agustus 2026'}</span>
                    </div>
                    <span style={{ backgroundColor: badge.bg, color: badge.color, padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                      {currentStatus}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                    <img src={itemImage} alt={itemName} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', backgroundColor: '#f1f5f9' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{itemName}</div>
                      <div style={{ color: '#64748b', fontSize: '13px' }}>{itemQty} x Rp {Number(itemPrice).toLocaleString('id-ID')}</div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px dashed #e2e8f0', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>Metode: <strong>{order.paymentMethod || 'Transfer Bank (Mandiri)'}</strong></span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#64748b', fontSize: '12px', display: 'block' }}>Total Pesanan</span>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#2563eb' }}>
                        Rp {(order.total || order.totalPrice || itemPrice * itemQty).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}