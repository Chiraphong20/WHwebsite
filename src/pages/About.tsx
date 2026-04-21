import React from 'react';
import { ChevronRight, Award, History, Warehouse, ShieldCheck, Users, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-dark text-white py-20 mb-20">
        <div className="absolute inset-0">
          <img
            src="/images/about/Screenshot 2026-03-21 190740.png"
            alt="โกดังวงษ์หิรัญ"
            className="w-full h-full object-cover opacity-30"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-orange-300 space-x-2 mb-6">
            <span className="text-gray-400">หน้าแรก</span>
            <ChevronRight size={14} />
            <span className="font-medium">เกี่ยวกับเรา</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              รู้จักกับ<br />
              <span className="text-primary-400">วงษ์หิรัญค้าส่ง</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
              เราคือพันธมิตรที่ช่วยให้คุณเริ่มต้นและเติบโตในธุรกิจร้าน 20 บาท ด้วยประสบการณ์กว่า 10 ปี และความจริงใจ
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 text-primary-500 font-bold uppercase tracking-wider text-sm">
              <History size={18} />
              <span>ประวัติและความเป็นมา</span>
            </div>
            <h2 className="text-3xl font-bold text-dark leading-tight">
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
              <div className="border-l-4 border-primary-500 pl-4">
                <div className="text-3xl font-bold text-dark">1,000+</div>
                <div className="text-sm text-gray-500">รายการสินค้า</div>
              </div>
              <div className="border-l-4 border-primary-500 pl-4">
                <div className="text-3xl font-bold text-dark">500+</div>
                <div className="text-sm text-gray-500">ลูกค้าเปิดร้านใหม่</div>
              </div>
              <div className="border-l-4 border-primary-500 pl-4">
                <div className="text-3xl font-bold text-dark">10+ ปี</div>
                <div className="text-sm text-gray-500">ประสบการณ์ค้าส่ง</div>
              </div>
              <div className="border-l-4 border-primary-500 pl-4">
                <div className="text-3xl font-bold text-dark">4 สาขา</div>
                <div className="text-sm text-gray-500">หน้าร้านในโคราช</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-primary-100">
              <img
                src="/images/about/Screenshot 2026-03-21 190740.png"
                alt="โกดังวงษ์หิรัญ"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-dark text-white p-5 rounded-2xl shadow-xl hidden md:block border border-primary-500/30">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-500 p-3 rounded-xl text-white">
                  <Warehouse size={24} />
                </div>
                <div>
                  <div className="font-bold">โกดังใหญ่พร้อมส่ง</div>
                  <div className="text-xs text-gray-400">สต็อกแน่นทุกรายการ</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="bg-dark rounded-3xl p-12 shadow-xl mb-24 relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-2xl font-bold text-white">ค่านิยมของเรา</h2>
            <p className="text-gray-400 mt-2 text-sm">สิ่งที่เราเชื่อและยึดมั่นในการทำธุรกิจทุกวัน</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {[
              { icon: <ShieldCheck size={32} />, title: 'ความซื่อสัตย์', desc: 'เราค้าขายด้วยความจริงใจ แจ้งรายละเอียดสินค้าและราคาอย่างตรงไปตรงมา' },
              { icon: <Award size={32} />, title: 'คุณภาพสินค้า', desc: 'คัดสรรสินค้าที่ใช้งานได้จริง ทนทาน และคุ้มค่ากับราคา 20 บาท' },
              { icon: <Users size={32} />, title: 'เติบโตไปด้วยกัน', desc: 'เราไม่ได้แค่ขายสินค้า แต่เราอยากเห็นลูกค้าประสบความสำเร็จในธุรกิจ' },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4 group"
              >
                <div className="w-16 h-16 mx-auto bg-primary-500/10 text-primary-400 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  {value.icon}
                </div>
                <h3 className="font-bold text-white text-lg">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-primary-50 border border-primary-100 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-primary-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <MapPin size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-dark mb-1">มาเยี่ยมชมโกดังของเรา</h3>
            <p className="text-gray-600">476/1 หมู่ 2 ต.บ้านเกาะ อ.เมือง จ.นครราชสีมา 30000</p>
            <p className="text-sm text-gray-500 mt-1">เปิดทุกวัน 08:00 – 17:30 น. | หยุดเฉพาะสงกรานต์และปีใหม่</p>
          </div>
          <a
            href="tel:0935022828"
            className="inline-flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors shrink-0"
          >
            <Phone size={18} />
            <span>093 502 2828</span>
          </a>
        </div>
      </div>
    </div>
  );
}
