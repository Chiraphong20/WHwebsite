import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, MessageCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-red-600 p-1.5 rounded-lg">
                <ShoppingBag className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                วงษ์หิรัญ<span className="text-red-600">ค้าส่ง</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              แหล่งรวมสินค้า 20 บาทราคาส่งที่ใหญ่ที่สุด พร้อมให้คำปรึกษาสำหรับผู้ที่ต้องการเริ่มต้นธุรกิจร้านทุกอย่าง 20 บาท
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">เมนูแนะนำ</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="hover:text-red-500 transition-colors">แคตตาล็อกสินค้า</Link></li>
              <li><Link to="/packages" className="hover:text-red-500 transition-colors">แพ็กเกจเปิดร้าน</Link></li>
              <li><Link to="/how-to-order" className="hover:text-red-500 transition-colors">วิธีการสั่งซื้อ</Link></li>
              <li><Link to="/about" className="hover:text-red-500 transition-colors">เกี่ยวกับเรา</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-6">หมวดหมู่สินค้า</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products?cat=สินค้าพลาสติก" className="hover:text-red-500 transition-colors">สินค้าพลาสติก</Link></li>
              <li><Link to="/products?cat=เครื่องครัว" className="hover:text-red-500 transition-colors">เครื่องครัว</Link></li>
              <li><Link to="/products?cat=ของเล่น" className="hover:text-red-500 transition-colors">ของเล่น</Link></li>
              <li><Link to="/products?cat=เครื่องมือช่าง" className="hover:text-red-500 transition-colors">เครื่องมือช่าง</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-6">ติดต่อเรา</h3>
            <div className="flex items-start space-x-3 text-sm">
              <MapPin size={18} className="text-red-500 shrink-0 mt-0.5" />
              <span>123 หมู่ 4 ต.ในเมือง อ.เมือง จ.นครราชสีมา 30000</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Phone size={18} className="text-red-500 shrink-0" />
              <span>08x-xxx-xxxx</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Clock size={18} className="text-red-500 shrink-0" />
              <span>เปิดทุกวัน 08:00 - 18:00 น.</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs">
          <p>© 2024 วงษ์หิรัญค้าส่ง 20 บาท. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-white transition-colors">เงื่อนไขการใช้บริการ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
