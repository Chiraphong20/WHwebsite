import React from 'react';
import { CheckCircle2, ChevronRight, MessageCircle, Store, Palette, Wallet, Unlock, MonitorSmartphone, ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { PACKAGES } from '../data/mockData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Packages() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center text-sm text-gray-500 space-x-2 mb-4">
            <span>หน้าแรก</span>
            <ChevronRight size={14} />
            <span className="text-primary-600 font-medium">แพ็กเกจแฟรนไชส์</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">แฟรนไชส์แบบพาร์ทเนอร์ (ไม่มีสัญญา)</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            เหมาะสำหรับท่านที่มีประสบการณ์เป็นเจ้าของธุรกิจแล้ว และต้องการแบรนด์ร้านค้าเป็นของตัวเอง 
            หรือต้องการขายสินค้าหลากหลายประเภทภายในร้านร่วมกัน
          </p>
        </div>

        {/* Feature Highlights from PDF */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { icon: <Store size={28} />, title: 'แบรนด์ของคุณเอง', desc: 'ร้านค้าเป็นแบรนด์ของคุณ คุณคือเจ้าของ 100%' },
            { icon: <Palette size={28} />, title: 'ตกแต่งอิสระ', desc: 'ดีไซน์และตกแต่งร้านค้าในสไตล์ที่คุณต้องการ' },
            { icon: <Unlock size={28} />, title: 'ไม่มีข้อผูกมัด', desc: 'ซื้อสินค้าจากแหล่งไหนเข้าร้านเพิ่มก็ได้ ไม่มีสัญญาผูกมัด' },
            { icon: <Wallet size={28} />, title: 'บริหารและลงทุนเอง', desc: 'บริหารร้านเอง ลงทุนเอง 100% กำไรรับเต็มๆ' }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-primary-50 text-center hover:shadow-lg hover:border-primary-100 transition-all"
            >
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">SALES PACKAGE</h2>
          <p className="text-gray-600">ราคานี้รวมรายการสินค้า ชั้นวาง เคาน์เตอร์ และป้ายร้านแล้ว</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className={`bg-white rounded-3xl overflow-hidden shadow-sm border flex flex-col relative ${idx === 1 ? 'border-primary-500 shadow-xl shadow-red-500/10 scale-105 z-10' : 'border-gray-100'}`}
            >
              {idx === 1 && (
                <div className="absolute top-0 inset-x-0 bg-primary-600 text-white text-sm font-bold text-center py-1.5 uppercase tracking-widest">
                  แพ็กเกจยอดนิยม
                </div>
              )}
              <div className={`w-full bg-white p-4 flex items-center justify-center ${idx === 1 ? 'mt-7' : ''}`}>
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-auto max-h-64 object-contain"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6 border-b border-gray-100 pb-6 text-center">
                  <h2 className="text-2xl font-black text-gray-900 mb-3">{pkg.name}</h2>
                  <div className="text-3xl font-extrabold text-primary-600 mb-3">{pkg.price}</div>
                  <p className="text-gray-500 text-sm font-medium">{pkg.description}</p>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider bg-gray-50 p-2 rounded-lg text-center">สิ่งที่จะได้รับ</h3>
                  <ul className="space-y-3">
                    {pkg.items.map((item, i) => (
                      <li key={i} className="flex items-start space-x-3 text-gray-600 text-sm font-medium">
                        <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 rounded-2xl font-bold text-center transition-all flex items-center justify-center space-x-2 ${
                    idx === 1 ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md' : 'bg-primary-50 text-primary-600 hover:bg-red-100'
                  }`}
                >
                  <MessageCircle size={20} />
                  <span>ปรึกษาและสั่งซื้อแพ็กเกจนี้</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Store Equipment Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">อุปกรณ์ตกแต่งร้านที่ได้รับ</h2>
            <p className="text-gray-600">ตัวอย่างชั้นวางสินค้าและอุปกรณ์คุณภาพมาตรฐาน</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { src: '/images/packages/shelf-single.png', label: 'ชั้นวางสินค้าหน้าเดียว' },
              { src: '/images/packages/shelf-double.png', label: 'ชั้นวางสินค้าสองหน้า' },
              { src: '/images/packages/shelf-mesh.png', label: 'แผงตาข่ายแบบหลัง/ตะขอแขวน' }
            ].map((equipment, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-full aspect-square flex items-center justify-center p-4 bg-gray-50 rounded-2xl mb-4 overflow-hidden">
                  <img src={equipment.src} alt={equipment.label} className="max-w-full max-h-full object-contain" loading="lazy" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg text-center">{equipment.label}</h3>
              </motion.div>
            ))}
          </div>
        </div>

        {/* GrowStore section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white flex flex-col items-center mb-24 shadow-2xl"
        >
          <div className="w-full text-center md:text-left mb-10">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MonitorSmartphone size={16} className="text-blue-400" />
              <span>FRIENDLY PLATFORM</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">GROW STORE PLATFORM</h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
              ระบบขายสินค้าแบบออนไลน์ ที่ออกแบบมาเพื่อบริหารจัดการร้านค้าปลีกอย่างมืออาชีพ 
              แถมฟรี 1 License ทันทีเมื่อเปิดแพ็กเกจร้านค้ากับเรา
            </p>
          </div>
          
          <div className="w-full bg-[#1e293b]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                <thead className="bg-blue-600/20 text-blue-100 font-semibold text-base border-b border-white/10">
                  <tr>
                    <th className="p-5 w-1/3">ความสามารถระบบ (Features)</th>
                    <th className="p-5 text-center border-l border-white/5">Free</th>
                    <th className="p-5 text-center border-l border-white/5">Basic</th>
                    <th className="p-5 text-center border-l border-white/5">Pro</th>
                    <th className="p-5 text-center border-l border-white/5 text-blue-400 font-bold bg-blue-500/10">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: 'จำนวนรายการสินค้า', free: '300', basic: '1,000', pro: '10,000', premium: 'ไม่จำกัด' },
                    { name: 'ระบบขายหน้าร้าน (POS)', free: true, basic: true, pro: true, premium: true },
                    { name: 'ระบบจัดการสต๊อกสินค้า', free: true, basic: true, pro: true, premium: true },
                    { name: 'แดชบอร์ดรายงานยอดขาย', free: 'พื้นฐาน', basic: true, pro: true, premium: true },
                    { name: 'ระบบสมาชิก/สะสมแต้ม (CRM)', free: false, basic: true, pro: true, premium: true },
                    { name: 'บริหารจัดการหลายสาขา', free: false, basic: false, pro: 'สูงสุด 3 สาขา', premium: 'ไม่จำกัดสาขา' },
                    { name: 'ดูรายงานผ่านมือถือแบบ Real-time', free: false, basic: false, pro: true, premium: true }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 px-5 font-medium text-white">{row.name}</td>
                      <td className="p-4 text-center border-l border-white/5">
                        {typeof row.free === 'boolean' ? (row.free ? <CheckCircle2 className="inline text-green-400 w-5 h-5"/> : <span className="text-gray-600">-</span>) : row.free}
                      </td>
                      <td className="p-4 text-center border-l border-white/5">
                        {typeof row.basic === 'boolean' ? (row.basic ? <CheckCircle2 className="inline text-green-400 w-5 h-5"/> : <span className="text-gray-600">-</span>) : row.basic}
                      </td>
                      <td className="p-4 text-center border-l border-white/5">
                        {typeof row.pro === 'boolean' ? (row.pro ? <CheckCircle2 className="inline text-green-400 w-5 h-5"/> : <span className="text-gray-600">-</span>) : row.pro}
                      </td>
                      <td className="p-4 text-center border-l border-white/5 bg-blue-500/5 font-semibold text-blue-200">
                        {typeof row.premium === 'boolean' ? (row.premium ? <CheckCircle2 className="inline text-blue-400 w-5 h-5"/> : <span className="text-gray-600">-</span>) : row.premium}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-blue-600/20 p-4 text-center text-sm font-medium text-blue-200 border-t border-white/10">
              ✨ แฟรนไชส์พาร์ทเนอร์จะได้รับสิทธิ์ใช้งานแพ็กเกจ <span className="font-bold text-white">Premium</span> ฟรี 1 License ทันที
            </div>
          </div>
        </motion.div>

        {/* POS GrowStore Features Grid */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">ฟีเจอร์เด่นของ GROW STORE POS</h3>
            <p className="text-gray-600">ตัวช่วยให้คุณบริหารร้าน 20 บาทได้อย่างมืออาชีพและง่ายดาย</p>
          </div>
          <div className="px-2">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              className="pb-16 px-4"
            >
              {[
                { src: '/images/pakages-pos-growstore/POS.png', label: 'ระบบแคชเชียร์หน้าจอ POS' },
                { src: '/images/pakages-pos-growstore/product.png', label: 'ระบบจัดการสต๊อกสินค้า' },
                { src: '/images/pakages-pos-growstore/report.png', label: 'แดชบอร์ดรายงานยอดขาย' },
                { src: '/images/pakages-pos-growstore/mobile-pos.png', label: 'ดูรายงานผ่านมือถือ' },
                { src: '/images/pakages-pos-growstore/branch.png', label: 'บริหารจัดการได้หลายสาขา' },
                { src: '/images/pakages-pos-growstore/shortcut-menu.png', label: 'เมนูลัดขายรวดเร็ว' }
              ].map((feature, idx) => (
                <SwiperSlide key={idx} className="h-auto pb-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col items-center justify-center h-full hover:scale-[1.02] transition-all text-center group cursor-pointer px-4 w-full"
                  >
                    <img src={feature.src} alt={feature.label} className="w-auto h-64 sm:h-80 md:h-96 lg:h-[400px] object-contain mix-blend-multiply mb-8" />
                    <h4 className="font-extrabold text-gray-900 text-2xl md:text-3xl">{feature.label}</h4>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ภาพกิจกรรมหน้าตาของร้าน</h2>
          <p className="text-gray-600">ตัวอย่างร้านค้าที่ใช้บริการแพ็กเกจและอุปกรณ์ตกแต่งของเรา</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            '625944877_1495111829287615_3307159896768661283_n.jpg',
            '625999582_1494767965988668_6283804814847378561_n.jpg',
            '648792989_1526453439486787_5066533745799125478_n.jpg',
            '649039943_1526453346153463_931526647838172594_n.jpg',
            '650335348_1532227425576055_6870237604650914477_n.jpg',
            '650359189_1532971292168335_1145679540030734189_n.jpg',
            '650381185_1532106315588166_8581240454353907097_n.jpg',
            '652971401_1532971392168325_1634730471391681130_n.jpg'
          ].map((imgUrl, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="aspect-square bg-gray-200 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
            >
              <img 
                src={`/images/activity/${imgUrl}`} 
                alt={`กิจกรรมร้านค้า ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ImageIcon className="text-white w-8 h-8 opacity-75" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

