import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-red-600 p-1.5 rounded-lg shadow-md">
                <ShoppingBag className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                วงษ์หิรัญ<span className="text-red-500">ค้าส่ง</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              แหล่งรวมสินค้า 20 บาทราคาส่งที่ใหญ่ที่สุดในโคราช พร้อมให้คำปรึกษาสำหรับผู้ที่ต้องการเริ่มต้นธุรกิจร้านทุกอย่าง 20 บาท
            </p>
            <div className="flex items-center space-x-4 pt-1">
              <a
                href="https://www.facebook.com/วงษ์หิรัญค้าส่ง20โคราช"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={17} className="text-white" />
              </a>
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@wonghiran20korat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-600 transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.82a4.85 4.85 0 01-1.07-.13z" />
                </svg>
              </a>
              {/* Messenger */}
              <a
                href="https://m.me/วงษ์หิรัญค้าส่ง20โคราช"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-500 transition-colors"
                aria-label="Messenger"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242C11.053 22.241 13.016 21.111 12 21.111 5.373 21.111 0 16.137 0 10 0 4.974 5.373 0 12 0zm1.05 14.932L10.63 12.34 5.9 14.932l5.364-5.694 2.469 2.592 4.729-2.592-5.412 5.694z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">เมนูแนะนำ</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="hover:text-red-400 transition-colors">แคตตาล็อกสินค้า</Link></li>
              <li><Link to="/packages" className="hover:text-red-400 transition-colors">แพ็กเกจเปิดร้าน</Link></li>
              <li><Link to="/how-to-order" className="hover:text-red-400 transition-colors">วิธีการสั่งซื้อ</Link></li>
              <li><Link to="/about" className="hover:text-red-400 transition-colors">เกี่ยวกับเรา</Link></li>
              <li><Link to="/contact" className="hover:text-red-400 transition-colors">ติดต่อเรา</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">หมวดหมู่สินค้า</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products?cat=ของเล่นเด็ก" className="hover:text-red-400 transition-colors">ของเล่นเด็ก</Link></li>
              <li><Link to="/products?cat=เครื่องครัว" className="hover:text-red-400 transition-colors">เครื่องครัว</Link></li>
              <li><Link to="/products?cat=กีฬากลางแจ้ง" className="hover:text-red-400 transition-colors">กีฬากลางแจ้ง</Link></li>
              <li><Link to="/products?cat=เครื่องมือช่าง" className="hover:text-red-400 transition-colors">เครื่องมือช่าง</Link></li>
              <li><Link to="/products?cat=ความงาม" className="hover:text-red-400 transition-colors">ความงาม</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">ติดต่อเรา</h3>
            <div className="flex items-start space-x-3 text-sm">
              <MapPin size={17} className="text-red-500 shrink-0 mt-0.5" />
              <span>476/1 หมู่ 2 ต.บ้านเกาะ อ.เมือง จ.นครราชสีมา 30000</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Phone size={17} className="text-red-500 shrink-0" />
              <a href="tel:0935022828" className="hover:text-white transition-colors">093 502 2828</a>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Mail size={17} className="text-red-500 shrink-0" />
              <a href="mailto:fukurouretail@gmail.com" className="hover:text-white transition-colors break-all">fukurouretail@gmail.com</a>
            </div>
            <div className="flex items-start space-x-3 text-sm">
              <Clock size={17} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p>เปิดทุกวัน 08:00 – 17:30 น.</p>
                <p className="text-xs text-gray-500 mt-0.5">หยุดเฉพาะวันสงกรานต์และวันปีใหม่</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-xs text-gray-600">
          <p>© 2025 วงษ์หิรัญค้าส่ง 20 บาท โคราช. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gray-300 transition-colors">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-gray-300 transition-colors">เงื่อนไขการใช้บริการ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
