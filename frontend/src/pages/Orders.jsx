import { useState, useEffect } from 'react';

export default function Orders() {
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [orders, setOrders] = useState([]);

  // Data Contoh Awal (Jika localStorage belum tersimpan)
  const defaultOrders = [
    {
      id: 'INV-839201',
      date: '14 Agustus 2026',
      status: 'Diproses',
      statusColor: '#d97706',
      statusBg: '#fef3c7',
      paymentMethod: 'Transfer Bank (BCA)',
      customerName: 'Budi Santoso',
      address: 'Jl. Merdeka No. 45, Jakarta Selatan',
      items: [
        {
          id: 1,
          name: 'Sepatu Sneaker Red Urban',
          price: 450000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60'
        },
        {
          id: 7,
          name: 'Tas Ransel Modern Waterproof',
          price: 280000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60'
        }
      ],
      total: 730000
    },
    {
      id: 'INV-710492',
      date: '10 Agustus 2026',
      status: 'Dikirim',
      statusColor: '#2563eb',
      statusBg: '#eff6ff',
      paymentMethod: 'E-Wallet (GoPay)',
      customerName: 'Budi Santoso',
      address: 'Jl. Merdeka No. 45, Jakarta Selatan',
      items: [
        {
          id: 12,
          name: 'Headphone Wireless Bass Boost',
          price: 550000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'
        }
      ],
      total: 550000
    }
  ];

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('userOrders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders(defaultOrders);
        localStorage.setItem('userOrders', JSON.stringify(defaultOrders));
      }
    } catch {
      setOrders(defaultOrders);
    }
  }, []);

  const statuses = ['Semua', 'Diproses', 'Dikirim', 'Selesai'];

  const filteredOrders = orders.filter(
    (order) => selectedStatus === 'Semua' || order.status === selectedStatus
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      padding: '24px 16px 80px'
    }}>
      <style>{`
        .status-chip {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .status-chip.active {
          background-color: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .order-card {
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          transition: all 0.2s ease;
        }

        .order-card:hover {
          border-color: #cbd5e1;
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header Page */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px', color: '#0f172a' }}>
            Riwayat Pesanan
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Pantau status transaksi dan pengiriman barang belanjaan Anda
          </p>
        </div>

        {/* Tab Filter Status */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`status-chip ${selectedStatus === status ? 'active' : ''}`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Daftar Pesanan */}
        {filteredOrders.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '50px 20px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '42px', display: 'block', marginBottom: '10px' }}>📦</span>
            <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: '#0f172a' }}>Tidak Ada Pesanan</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Belum ada pesanan dengan status "{selectedStatus}".
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginRight: '10px' }}>
                    {order.id}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{order.date}</span>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: order.statusColor || '#2563eb',
                  backgroundColor: order.statusBg || '#eff6ff',
                  padding: '4px 10px',
                  borderRadius: '12px'
                }}>
                  {order.status}
                </span>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#f1f5f9' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Metode: <strong style={{ color: '#334155' }}>{order.paymentMethod}</strong>
                </span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Total Pesanan</span>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#2563eb' }}>
                    Rp {order.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}