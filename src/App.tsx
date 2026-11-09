import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActionButton from './components/FloatingActionButton';
import ScrollToTop from './components/ScrollToTop';
import PreviewBridge from './components/PreviewBridge';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Packages from './pages/Packages';
import HowToOrder from './pages/HowToOrder';
import About from './pages/About';
import Contact from './pages/Contact';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Admin from './pages/Admin';

// เมื่อเข้าเว็บผ่าน subdomain เช่น admin.wonghiran.com ให้แสดงแค่หน้าแอดมิน
// ไม่ต้องมี Navbar/Footer/ปุ่มลอยของหน้าร้าน — ทุก path บน subdomain นี้เข้าสู่หน้าแอดมินเหมือนกันหมด
const isAdminSubdomain = typeof window !== 'undefined' && window.location.hostname.split('.')[0] === 'admin';

// หน้าแอดมิน (/admin) แยกออกมาเป็นหน้าจอของตัวเอง ไม่มี Navbar/Footer/ปุ่มลอยของหน้าร้าน
function Shell() {
  const { pathname } = useLocation();
  if (isAdminSubdomain || pathname === '/admin' || pathname.startsWith('/admin/')) {
    return <Admin />;
  }
  return (
    <AuthProvider>
      <ScrollToTop />
      <PreviewBridge />
      <div className="min-h-screen flex flex-col font-sans text-gray-900 selection:bg-primary-100 selection:text-primary-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/how-to-order" element={<HowToOrder />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
          </Routes>
        </main>
        <Footer />
        <FloatingActionButton />
      </div>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Shell />
    </Router>
  );
}
