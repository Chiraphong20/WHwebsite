import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActionButton from './components/FloatingActionButton';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Packages from './pages/Packages';
import HowToOrder from './pages/HowToOrder';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
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
          </Routes>
        </main>
        <Footer />
        <FloatingActionButton />
      </div>
    </Router>
    </AuthProvider>
  );
}
