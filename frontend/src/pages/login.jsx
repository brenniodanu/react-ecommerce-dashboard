import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import API from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  // Fungsi helper untuk menampilkan notifikasi modern
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  // LOGIN MANUAL (Email & Password)
  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      showNotification('Login berhasil! Mengalihkan...', 'success');

      setTimeout(() => {
        if (res.data.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        window.location.reload();
      }, 1000);

    } catch (err) {
      showNotification(err.response?.data?.message || 'Login gagal!', 'error');
    }
  };

  // LOGIN GOOGLE
  const handleGoogleSuccess = async (response) => {
    try {
      const res = await API.post('/auth/google', {
        credential: response.credential,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      showNotification('Login dengan Google Berhasil! Mengalihkan...', 'success');

      setTimeout(() => {
        if (res.data.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        window.location.reload();
      }, 1000);

    } catch (err) {
      console.error(err);
      showNotification('Gagal Login dengan akun Google', 'error');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 65px)',
      width: '100%',
      background: 'linear-gradient(135deg, #0b1329 0%, #0f172a 50%, #1e293b 100%)',
      padding: '40px 20px',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      position: 'relative'
    }}>
      {/* Global Style & Animations */}
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #0b1329 !important;
          width: 100% !important;
          min-height: 100vh !important;
        }

        @keyframes cardPop {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        .blue-card {
          animation: cardPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .modern-toast {
          animation: fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .floating-icon {
          animation: floatIcon 3.5s ease-in-out infinite;
        }

        .blue-input {
          transition: all 0.25s ease;
        }

        .blue-input:focus {
          border-color: #38bdf8 !important;
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.25) !important;
          background-color: #0b1329 !important;
        }

        .btn-blue-glow {
          transition: all 0.25s ease;
          background: linear-gradient(135deg, #2563eb 0%, #0284c7 100%);
        }

        .btn-blue-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.45);
          filter: brightness(1.1);
        }

        .btn-blue-glow:active {
          transform: translateY(0);
        }
      `}</style>

      {/* Modern Floating Notification Toast (Pengganti Alert Bawaan Browser) */}
      {notification.show && (
        <div className="modern-toast" style={{
          position: 'fixed',
          top: '30px',
          zIndex: 9999,
          backgroundColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          backdropFilter: 'blur(12px)',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: '14px',
          fontWeight: '600',
          fontSize: '14px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>{notification.type === 'success' ? '✅' : '⚠️'}</span>
          {notification.message}
        </div>
      )}

      {/* Main Glassmorphic Card */}
      <div className="blue-card" style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'rgba(30, 41, 59, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '24px',
        padding: '40px 36px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.12)',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff'
      }}>
        {/* Glow Ambient Lighting */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: '#38bdf8',
          filter: 'blur(65px)',
          animation: 'pulseGlow 5s ease-in-out infinite',
          pointerEvents: 'none'
        }}></div>

        {/* Header Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 2 }}>
          <div className="floating-icon" style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 16px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 8px 20px rgba(56, 189, 248, 0.15)'
          }}>
            🛒
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
            Masuk ke E-Store
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Masukkan akun kamu untuk melanjutkan belanja.
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleManualLogin} style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email
            </label>
            <input 
              className="blue-input"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@gmail.com"
              required 
              style={{ 
                width: '100%', 
                padding: '13px 16px', 
                borderRadius: '12px', 
                border: '1.5px solid #334155', 
                backgroundColor: '#0f172a',
                outline: 'none',
                fontSize: '14px',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Password
            </label>
            <input 
              className="blue-input"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
              style={{ 
                width: '100%', 
                padding: '13px 16px', 
                borderRadius: '12px', 
                border: '1.5px solid #334155', 
                backgroundColor: '#0f172a',
                outline: 'none',
                fontSize: '14px',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button 
            className="btn-blue-glow"
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              fontWeight: '700', 
              fontSize: '15px'
            }}
          >
            Masuk
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', position: 'relative', zIndex: 2 }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
          <span style={{ margin: '0 14px', fontSize: '12px', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px' }}>atau</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
        </div>

        {/* Google Login */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => showNotification('Login Google Gagal!', 'error')}
            text="continue_with"
            shape="rectangular"
            width="100%"
          />
        </div>

        {/* Register Link */}
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8', margin: '28px 0 0', position: 'relative', zIndex: 2 }}>
          Belum punya akun? <Link to="/register" style={{ color: '#38bdf8', fontWeight: '700', textDecoration: 'none' }}>Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}