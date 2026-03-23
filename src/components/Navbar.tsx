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
              <img src="/images/้home/1024303_0-removebg-preview.png" alt="Fukuro Cat Logo" className="w-full h-full object-contain p-1" />
            </div>
            <span className={`font-bold text-2xl tracking-tight transition-colors ${scrolled ? 'text-dark' : 'text-gray-900'}`}>
              วงษ์หิรัญ<span className="text-primary-500">ค้าส่ง</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-base font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === item.path ? 'text-primary-500' : 'text-gray-700'
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                  />
                )}
              </Link>
            ))}
            <Link
              to="/contact"
              className="bg-primary-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
            >
              <Phone size={16} className="animate-pulse" />
              <span>ติดต่อด่วน</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-500 focus:outline-none transition-colors"
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
            className="md:hidden glass border-t border-gray-100/50 overflow-hidden"
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
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-500'
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

