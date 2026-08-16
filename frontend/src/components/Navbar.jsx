import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar({ searchTerm = '', setSearchTerm }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { cartItems = [] } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setIsMenuOpen(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (setSearchTerm) setSearchTerm(value);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#0f172a',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid #1e293b',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <style>{`
        .desktop-menu { display: flex; align-items: center; gap: 20px; }
        .mobile-actions { display: none; align-items: center; gap: 8px; }

        .round-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #1e293b;
          border: 1px solid #334155;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          padding: 0;
        }
        .round-btn:hover { background-color: #334155; }
        .round-btn:active { transform: scale(0.92); }

        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          z-index: 999;
          opacity: ${isMenuOpen ? 1 : 0};
          pointer-events: ${isMenuOpen ? 'auto' : 'none'};
          transition: opacity 0.3s ease;
        }

        .drawer-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 82%;
          max-width: 320px;
          height: 100vh;
          background: #0f172a;
          border-left: 1px solid #1e293b;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          transform: translateX(${isMenuOpen ? '0%' : '100%'});
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 20px;
          box-sizing: border-box;
        }

        .menu-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #1e293b;
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-actions { display: flex !important; }
        }
      `}</style>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '20px' }}>🛒</span>
          <span style={{ color: '#ffffff', fontWeight: '800', fontSize: '18px' }}>
            E-Store<span style={{ color: '#38bdf8' }}>.</span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <div className="desktop-menu">
          <Link to="/" style={{ color: isActive('/') ? '#38bdf8' : '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Home</Link>
          {token && (
            <>
              <Link to="/cart" style={{ color: isActive('/cart') ? '#38bdf8' : '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                Keranjang {totalItems > 0 && `(${totalItems})`}
              </Link>
              <Link to="/orders" style={{ color: isActive('/orders') ? '#38bdf8' : '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Riwayat</Link>
              
              {/* Tombol Admin Khusus Akun Admin (Desktop) */}
              {user.role === 'admin' && (
                <Link to="/admin" style={{ color: isActive('/admin') ? '#38bdf8' : '#eab308', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                  ⚙️ Admin
                </Link>
              )}
            </>
          )}
          {!token ? (
            <Link to="/login" style={{ color: '#fff', backgroundColor: '#2563eb', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Login</Link>
          ) : (
            <button onClick={handleLogout} style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}>Logout</button>
          )}
        </div>

        {/* Action Buttons HP/Tablet */}
        <div className="mobile-actions">
          <button 
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} 
            className="round-btn" 
            aria-label="Cari Produk"
            style={{ backgroundColor: isMobileSearchOpen ? '#2563eb' : '#1e293b', borderColor: isMobileSearchOpen ? '#2563eb' : '#334155' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </button>

          <Link to="/cart" onClick={closeMenu} className="round-btn" aria-label="Keranjang Belanja">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '10px',
                fontWeight: '800',
                borderRadius: '50%',
                minWidth: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #0f172a'
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          <button onClick={() => setIsMenuOpen(true)} className="round-btn" aria-label="Buka Menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Input Search Dropdown HP */}
      {isMobileSearchOpen && (
        <div style={{ backgroundColor: '#1e293b', padding: '10px 16px', borderTop: '1px solid #334155' }}>
          <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
            <input
              type="text"
              autoFocus
              placeholder="Cari produk berdasarkan nama..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '10px 36px 10px 38px',
                borderRadius: '20px',
                border: '1px solid #475569',
                backgroundColor: '#0f172a',
                color: '#fff',
                outline: 'none',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm && setSearchTerm('')} 
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Drawer Overlay & Panel Mobile */}
      <div className="drawer-overlay" onClick={closeMenu} />
      <div className="drawer-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '16px' }}>Menu Navigasi</span>
          <button onClick={closeMenu} className="round-btn" style={{ width: '32px', height: '32px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#1e293b', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px', flexShrink: 0 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '14px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.name || 'Pengguna'}</div>
              <div style={{ color: '#64748b', fontSize: '12px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.email || 'user@email.com'}</div>
            </div>
          </div>
        ) : (
          <Link to="/login" onClick={closeMenu} style={{ display: 'block', textAlign: 'center', color: '#fff', backgroundColor: '#2563eb', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', marginBottom: '16px' }}>
            Masuk / Daftar
          </Link>
        )}

        <div style={{ flex: 1 }}>
          <Link to="/" onClick={closeMenu} className={`menu-row ${isActive('/') ? 'active' : ''}`}>
            <span>Beranda</span>
            <span>›</span>
          </Link>
          {token && (
            <Link to="/orders" onClick={closeMenu} className={`menu-row ${isActive('/orders') ? 'active' : ''}`}>
              <span>Riwayat Pesanan</span>
              <span>›</span>
            </Link>
          )}
          {/* Tombol Admin Khusus Akun Admin (Mobile Drawer) */}
          {token && user.role === 'admin' && (
            <Link to="/admin" onClick={closeMenu} className={`menu-row ${isActive('/admin') ? 'active' : ''}`}>
              <span style={{ color: '#eab308' }}>⚙️ Panel Admin</span>
              <span>›</span>
            </Link>
          )}
        </div>

        {token && (
          <button onClick={handleLogout} style={{ width: '100%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Keluar Akun
          </button>
        )}
      </div>
    </nav>
  );
}