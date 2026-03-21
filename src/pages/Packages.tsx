import React from 'react';
import { CheckCircle2, ChevronRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { PACKAGES } from '../data/mockData';

export default function Packages() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center text-sm text-gray-500 space-x-2 mb-4">
            <span>หน้าแรก</span>
            <ChevronRight size={14} />
            <span className="text-red-600 font-medium">แพ็กเกจเปิดร้าน</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">แพ็กเกจสำหรับคนเริ่มต้นเปิดร้าน</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            เราคัดสรรสินค้าขายดีที่จำเป็นสำหรับร้าน 20 บาท จัดเป็นเซ็ตพร้อมขาย 
            ช่วยให้คุณเริ่มต้นธุรกิจได้ง่ายขึ้น ไม่ต้องกังวลเรื่องการเลือกสินค้า
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h2>
                    <p className="text-gray-500 text-sm">{pkg.description}</p>
                  </div>
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-lg">
                    {pkg.price}
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">สิ่งที่จะได้รับ:</h3>
                  <ul className="space-y-3">
                    {pkg.items.map((item, i) => (
                      <li key={i} className="flex items-start space-x-3 text-gray-600">
                        <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-center hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle size={20} />
                  <span>ปรึกษาและสั่งซื้อแพ็กเกจนี้</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extra Services */}
        <div className="mt-20 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">บริการเสริมสำหรับคนเปิดร้านใหม่</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'จัดชั้นวางสินค้า', desc: 'บริการออกแบบและจัดวางชั้นวางสินค้าให้เหมาะสมกับพื้นที่ร้าน' },
              { title: 'ป้ายร้านและสื่อโฆษณา', desc: 'ออกแบบและผลิตป้ายหน้าร้าน ป้ายราคา และสื่อตกแต่งร้าน' },
              { title: 'ระบบจัดการร้าน', desc: 'แนะนำระบบ POS และการบริหารจัดการสต็อกสินค้าเบื้องต้น' },
            ].map((service, i) => (
              <div key={i} className="space-y-3">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 font-bold text-xl">
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
