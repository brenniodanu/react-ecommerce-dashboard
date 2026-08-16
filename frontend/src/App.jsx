import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import AdminProducts from './pages/AdminProducts';
import RiwayatPesanan from './pages/RiwayatPesanan'; 

// 1. 👈 IMPORT ProtectedRoute DARI FOLDER COMPONENTS
import ProtectedRoute from './components/ProtectedRoute';

const GOOGLE_CLIENT_ID = "142187596314-8jco1u7jt8526sm9kqcr6q667rq5hugs.apps.googleusercontent.com";

// (Fungsi ProtectedAdminRoute lama di sini sudah DIHAPUS agar tidak bentrok)

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CartProvider>
        <Router>
          <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <main className="app-container">
            <Routes>
              <Route path="/" element={<Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              
              <Route path="/orders" element={<RiwayatPesanan />} />
              <Route path="/riwayat" element={<RiwayatPesanan />} />
              
              {/* 2. 👈 GANTI DENGAN ProtectedRoute */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminProducts />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </Router>
      </CartProvider>
    </GoogleOAuthProvider>
  );
}