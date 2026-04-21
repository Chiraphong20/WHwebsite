import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'สินค้า', path: '/products' },
  { name: 'แพ็กเกจเปิดร้าน', path: '/packages' },
  { name: 'เกี่ยวกับเรา', path: '/about' },
  { name: 'ติดต่อเรา', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm border border-orange-100 group-hover:shadow-md transition-shadow">
              <img src="/images/logo.png" alt="วงษ์หิรัญค้าส่ง Logo" className="w-full h-auto object-contain p-0.5" />
            </div>
            <span className={`font-extrabold text-2xl tracking-tighter transition-colors ${scrolled ? 'text-zinc-950' : 'text-zinc-900'}`}>
              วงษ์หิรัญ<span className="text-primary-500">ค้าส่ง</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm uppercase tracking-widest font-bold transition-all duration-300 hover:text-primary-500 ${
                  location.pathname === item.path ? 'text-primary-500' : (scrolled ? 'text-zinc-700' : 'text-zinc-800')
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                  />
                )}
              </Link>
            ))}
            <Link
              to="/contact"
              className="bg-zinc-950 text-white px-7 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary-500 hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 flex items-center space-x-2 border border-zinc-800"
            >
              <Phone size={14} className="animate-pulse text-primary-500" />
              <span>ติดต่อด่วน</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-950 hover:text-primary-500 focus:outline-none transition-colors p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-zinc-100/50 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-zinc-700 hover:bg-zinc-50 hover:text-primary-500'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 px-2">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex justify-center items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-3.5 rounded-xl text-base font-semibold shadow-md active:scale-95 transition-all"
                >
                  <Phone size={18} className="animate-pulse" />
                  <span>ติดต่อสอบถามด่วน</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

