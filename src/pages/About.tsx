import React from 'react';
import { ChevronRight, Award, History, Warehouse, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center text-sm text-gray-500 space-x-2 mb-4">
            <span>หน้าแรก</span>
            <ChevronRight size={14} />
            <span className="text-red-600 font-medium">เกี่ยวกับเรา</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">รู้จักกับ วงษ์หิรัญค้าส่ง</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            เราคือพันธมิตรที่ช่วยให้คุณเริ่มต้นและเติบโตในธุรกิจร้าน 20 บาท ด้วยประสบการณ์และความจริงใจ
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 text-red-600 font-bold uppercase tracking-wider text-sm">
              <History size={18} />
              <span>ประวัติและความเป็นมา</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              จากร้านค้าเล็กๆ สู่โกดังค้าส่งขนาดใหญ่ที่ได้รับความไว้วางใจ
            </h2>
            <p className="text-gray-600 leading-relaxed">
              วงษ์หิรัญค้าส่ง เริ่มต้นจากการเป็นร้านขายปลีกสินค้าเบ็ดเตล็ด 
              เราเข้าใจดีว่าพ่อค้าแม่ค้าต้องการอะไร ทั้งในเรื่องของคุณภาพสินค้า ราคาที่แข่งขันได้ 
              และความหลากหลายที่ตอบโจทย์ผู้บริโภค
            </p>
            <p className="text-gray-600 leading-relaxed">
              ปัจจุบันเราได้ขยายตัวเป็นโกดังค้าส่งขนาดใหญ่ในจังหวัดนครราชสีมา 
              ที่รวบรวมสินค้าจากโรงงานโดยตรง เพื่อส่งต่อสินค้าคุณภาพในราคาที่คุ้มค่าที่สุดให้กับลูกค้าทั่วประเทศ
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="border-l-4 border-red-600 pl-4">
                <div className="text-3xl font-bold text-gray-900">1,000+</div>
                <div className="text-sm text-gray-500">รายการสินค้า</div>
              </div>
              <div className="border-l-4 border-red-600 pl-4">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-500">ลูกค้าเปิดร้านใหม่</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://picsum.photos/seed/about-warehouse/800/600"
                alt="Our Warehouse"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="bg-red-50 p-3 rounded-xl text-red-600">
                  <Warehouse size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900">โกดังใหญ่พร้อมส่ง</div>
                  <div className="text-xs text-gray-500">สต็อกแน่นทุกรายการ</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">ค่านิยมของเรา</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <ShieldCheck className="text-red-600" />, title: 'ความซื่อสัตย์', desc: 'เราค้าขายด้วยความจริงใจ แจ้งรายละเอียดสินค้าและราคาอย่างตรงไปตรงมา' },
              { icon: <Award className="text-red-600" />, title: 'คุณภาพสินค้า', desc: 'คัดสรรสินค้าที่ใช้งานได้จริง ทนทาน และคุ้มค่ากับราคา 20 บาท' },
              { icon: <Users className="text-red-600" />, title: 'เติบโตไปด้วยกัน', desc: 'เราไม่ได้แค่ขายสินค้า แต่เราอยากเห็นลูกค้าประสบความสำเร็จในธุรกิจ' },
            ].map((value, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="flex justify-center">{value.icon}</div>
                <h3 className="font-bold text-gray-900">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
