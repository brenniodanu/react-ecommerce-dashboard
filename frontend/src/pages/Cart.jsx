import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  // State Formulir Checkout
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'Transfer Bank (BCA)'
  });

  // State Modal Pesanan Sukses
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Kalkulasi Harga
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 100000 || subtotal === 0 ? 0 : 15000;
  const grandTotal = subtotal + shippingFee;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const invoiceId = 'INV-' + Math.floor(100000 + Math.random() * 900000);

    // 1. Buat Objek Pesanan (disamakan propertinya dengan Admin)
    const newOrder = {
      id: invoiceId,
      invoice: invoiceId,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      status: 'Diproses',
      statusColor: '#d97706',
      statusBg: '#fef3c7',
      paymentMethod: formData.paymentMethod,
      name: formData.name, // Disamakan dengan Admin
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      items: [...cartItems],
      total: grandTotal
    };

    // 2. Simpan ke localStorage dengan kunci 'orders'
    try {
      const savedOrders = localStorage.getItem('orders');
      const currentOrders = savedOrders ? JSON.parse(savedOrders) : [];
      const updatedOrders = [newOrder, ...currentOrders];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error('Gagal menyimpan ke Riwayat Pesanan:', error);
    }

    // 3. Tampilkan modal, kosongkan keranjang, dan reset form
    setOrderSuccess(newOrder);
    clearCart();
    setFormData({
      name: '',
      phone: '',
      address: '',
      paymentMethod: 'Transfer Bank (BCA)'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      padding: '24px 16px 80px'
    }}>
      <style>{`
        .cart-container {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 868px) {
          .cart-container {
            grid-template-columns: 1.6fr 1fr;
          }
        }

        .btn-qty {
          border: 1px solid #cbd5e1;
          background-color: #ffffff;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-qty:hover {
          background-color: #f1f5f9;
        }

        .form-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13px;
          box-sizing: border-box;
          margin-top: 4px;
          outline: none;
        }

        .form-input:focus {
          border-color: #2563eb;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* MODAL PESANAN BERHASIL */}
      {orderSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            animation: 'fadeIn 0.25s ease-out'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
            <h2 style={{ margin: '0 0 6px', fontSize: '20px', color: '#0f172a' }}>Pesanan Berhasil Dibuat!</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
              No. Invoice: <strong style={{ color: '#2563eb' }}>{orderSuccess.id}</strong>
            </p>

            <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px', textAlign: 'left', fontSize: '13px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ margin: '4px 0' }}><strong>Penerima:</strong> {orderSuccess.customerName} ({orderSuccess.phone})</div>
              <div style={{ margin: '4px 0' }}><strong>Alamat:</strong> {orderSuccess.address}</div>
              <div style={{ margin: '4px 0' }}><strong>Metode Bayar:</strong> {orderSuccess.paymentMethod}</div>
              <div style={{ margin: '10px 0 4px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '14px' }}>
                <span>Total Pembayaran:</span>
                <span style={{ color: '#2563eb' }}>Rp {orderSuccess.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Kembali Belanja
            </button>
          </div>
        </div>
      )}

      {/* KONDISI KERANJANG KOSONG */}
      {cartItems.length === 0 ? (
        <div style={{
          maxWidth: '560px',
          margin: '40px auto 0',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <span style={{ fontSize: '56px', display: 'block', marginBottom: '12px' }}>🛒</span>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Keranjang Anda Kosong</h2>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>
            Belum ada produk yang ditambahkan. Silakan pilih barang di katalog.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            Mulai Belanja
          </a>
        </div>
      ) : (
        /* KONDISI KERANJANG TERISI */
        <div className="cart-container">
          {/* KOLOM KIRI: DAFTAR BARANG */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 16px', color: '#0f172a' }}>
              Keranjang Belanja ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '14px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', backgroundColor: '#f1f5f9' }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#2563eb', marginBottom: '8px' }}>
                      Rp {item.price.toLocaleString('id-ID')}
                    </div>

                    {/* PERBAIKAN TOMBOL + DAN - ADA DI SINI */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button className="btn-qty" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span style={{ fontSize: '13px', fontWeight: '700', width: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button className="btn-qty" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KOLOM KANAN: FORM CHECKOUT & RINGKASAN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Ringkasan Belanja */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                Ringkasan Belanja
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                <span>Total Harga ({cartItems.reduce((a, b) => a + b.quantity, 0)} barang)</span>
                <span style={{ color: '#0f172a', fontWeight: '600' }}>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                <span>Ongkos Kirim</span>
                <span style={{ color: shippingFee === 0 ? '#10b981' : '#0f172a', fontWeight: '600' }}>
                  {shippingFee === 0 ? 'GRATIS' : `Rp ${shippingFee.toLocaleString('id-ID')}`}
                </span>
              </div>

              <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                <span>Total Bayar</span>
                <span style={{ color: '#2563eb' }}>Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Form Pengiriman & Bayar */}
            <form onSubmit={handleCheckout} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                Pengiriman & Pembayaran
              </h3>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Nomor WhatsApp / HP</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Contoh: 08123456789"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Alamat Lengkap</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  placeholder="Jalan, No. Rumah, Kecamatan, Kota"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Metode Pembayaran</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="Transfer Bank (BCA)">Transfer Bank (BCA)</option>
                  <option value="Transfer Bank (Mandiri)">Transfer Bank (Mandiri)</option>
                  <option value="E-Wallet (GoPay/OVO/Dana)">E-Wallet (GoPay / OVO / DANA)</option>
                  <option value="COD (Bayar di Tempat)">COD (Bayar di Tempat)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
              >
                Bayar Sekarang
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}