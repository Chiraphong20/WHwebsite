import React from 'react';
import { ChevronRight, ClipboardList, MessageSquare, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const steps = [
  {
    icon: <ClipboardList size={32} />,
    title: 'เลือกสินค้า',
    desc: 'เลือกสินค้าที่ต้องการจากหน้าเว็บ หรือขอรับไฟล์แคตตาล็อกผ่านทาง Line'
  },
  {
    icon: <MessageSquare size={32} />,
    title: 'ส่งรายการสั่งซื้อ',
    desc: 'แคปรูปสินค้าหรือส่งรายการที่ต้องการมาที่ Line OA ของร้าน'
  },
  {
    icon: <CreditCard size={32} />,
    title: 'สรุปยอดและชำระเงิน',
    desc: 'เจ้าหน้าที่จะสรุปยอดเงินพร้อมค่าจัดส่ง และแจ้งเลขบัญชีเพื่อโอนชำระ'
  },
  {
    icon: <Truck size={32} />,
    title: 'จัดส่งสินค้า',
    desc: 'หลังจากแจ้งโอน ร้านจะทำการแพ็คและจัดส่งสินค้าภายใน 1-2 วันทำการ'
  }
];

export default function HowToOrder() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center text-sm text-gray-500 space-x-2 mb-4">
            <span>หน้าแรก</span>
            <ChevronRight size={14} />
            <span className="text-red-600 font-medium">วิธีการสั่งซื้อ</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ขั้นตอนการสั่งซื้อและเงื่อนไข</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            เราเน้นความสะดวกและรวดเร็วในการสั่งซื้อ เพื่อให้พ่อค้าแม่ค้าได้รับสินค้าไปขายได้ทันที
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                {idx + 1}
              </div>
              <div className="text-red-600 mb-6">{step.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Terms & Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <CheckCircle className="text-green-500" />
              <span>เงื่อนไขการขายส่ง (Wholesale Terms)</span>
            </h2>
            <ul className="space-y-4">
              {[
                'ขั้นต่ำในการสั่งซื้อครั้งแรก 5,000 บาทขึ้นไป',
                'การสั่งซื้อครั้งต่อไปไม่มีขั้นต่ำ (สำหรับลูกค้าประจำ)',
                'ราคาสินค้ายังไม่รวมค่าจัดส่ง',
                'สินค้าบางรายการขายเป็นโหล ไม่แบ่งแยกชิ้น',
                'รับประกันสินค้าเสียหายจากการขนส่ง (ต้องมีวิดีโอตอนแกะกล่อง)'
              ].map((term, i) => (
                <li key={i} className="flex items-start space-x-3 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></div>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Truck className="text-blue-500" />
              <span>การจัดส่งสินค้า (Shipping)</span>
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">ขนส่งที่ใช้บริการ:</h3>
                <p className="text-gray-600 text-sm">
                  เราจัดส่งผ่านขนส่งเอกชนชั้นนำ เช่น Flash Express, Kerry, J&T 
                  และขนส่งรถบรรทุกสำหรับยอดสั่งซื้อขนาดใหญ่
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">ค่าจัดส่ง:</h3>
                <p className="text-gray-600 text-sm">
                  คิดตามน้ำหนักและปริมาตรจริงของสินค้าตามเรทขนส่ง 
                  หรือเหมาจ่ายตามตกลงสำหรับยอดสั่งซื้อจำนวนมาก
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">ระยะเวลาจัดส่ง:</h3>
                <p className="text-gray-600 text-sm">
                  กรุงเทพฯ และปริมณฑล: 1-2 วันทำการ<br />
                  ต่างจังหวัด: 2-3 วันทำการ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
